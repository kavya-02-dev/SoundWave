using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpotifyApp.API.Data;
using SpotifyApp.API.DTOs;
using SpotifyApp.API.Models;
using System.Security.Claims;

namespace SpotifyApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HistoryController : ControllerBase
{
    private readonly AppDbContext _db;
    public HistoryController(AppDbContext db) => _db = db;

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetHistory()
    {
        var userId = GetUserId();
        var history = await _db.PlayHistories
            .Where(h => h.UserId == userId)
            .Include(h => h.Song)
            .OrderByDescending(h => h.PlayedAt)
            .Take(50)
            .Select(h => new PlayHistoryDto(h.Id, h.SongId, h.Song.Title, h.Song.Artist, h.Song.CoverUrl, h.PlayedAt))
            .ToListAsync();
        return Ok(history);
    }

    [HttpDelete]
    public async Task<IActionResult> ClearHistory()
    {
        var userId = GetUserId();
        var history = await _db.PlayHistories.Where(h => h.UserId == userId).ToListAsync();
        _db.PlayHistories.RemoveRange(history);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PlaylistsController : ControllerBase
{
    private readonly AppDbContext _db;
    public PlaylistsController(AppDbContext db) => _db = db;

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();
        var playlists = await _db.Playlists
            .Where(p => p.UserId == userId)
            .Include(p => p.PlaylistSongs).ThenInclude(ps => ps.Song)
            .ToListAsync();
        return Ok(playlists.Select(p => new PlaylistDto(p.Id, p.Name, p.UserId,
            p.PlaylistSongs.Select(ps => new SongDto(ps.Song.Id, ps.Song.Title, ps.Song.Artist, ps.Song.Album, ps.Song.Genre, ps.Song.CoverUrl, ps.Song.AudioUrl, ps.Song.Duration)).ToList())));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePlaylistRequest req)
    {
        var userId = GetUserId();
        var pl = new Playlist { Name = req.Name, UserId = userId };
        _db.Playlists.Add(pl);
        await _db.SaveChangesAsync();
        return Ok(new PlaylistDto(pl.Id, pl.Name, pl.UserId, new List<SongDto>()));
    }

    [HttpPost("{id}/songs/{songId}")]
    public async Task<IActionResult> AddSong(int id, int songId)
    {
        var userId = GetUserId();
        var pl = await _db.Playlists.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
        if (pl == null) return NotFound();
        if (!await _db.PlaylistSongs.AnyAsync(ps => ps.PlaylistId == id && ps.SongId == songId))
        {
            _db.PlaylistSongs.Add(new PlaylistSong { PlaylistId = id, SongId = songId });
            await _db.SaveChangesAsync();
        }
        return Ok();
    }

    [HttpDelete("{id}/songs/{songId}")]
    public async Task<IActionResult> RemoveSong(int id, int songId)
    {
        var ps = await _db.PlaylistSongs.FirstOrDefaultAsync(ps => ps.PlaylistId == id && ps.SongId == songId);
        if (ps == null) return NotFound();
        _db.PlaylistSongs.Remove(ps);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();
        var pl = await _db.Playlists.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
        if (pl == null) return NotFound();
        _db.Playlists.Remove(pl);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;
    public UsersController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _db.Users.Select(u => new UserDto(u.Id, u.Username, u.Role, u.CreatedAt)).ToListAsync();
        return Ok(users);
    }
}
