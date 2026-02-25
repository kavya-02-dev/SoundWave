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
public class SongsController : ControllerBase
{
    private readonly AppDbContext _db;

    public SongsController(AppDbContext db) => _db = db;

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? genre)
    {
        var userId = GetUserId();
        var likedIds = await _db.Likes.Where(l => l.UserId == userId).Select(l => l.SongId).ToListAsync();

        var query = _db.Songs.AsQueryable();
        if (!string.IsNullOrEmpty(search))
            query = query.Where(s => s.Title.Contains(search) || s.Artist.Contains(search) || s.Album.Contains(search));
        if (!string.IsNullOrEmpty(genre))
            query = query.Where(s => s.Genre == genre);

        var songs = await query.ToListAsync();
        return Ok(songs.Select(s => ToDto(s, likedIds.Contains(s.Id))));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = GetUserId();
        var song = await _db.Songs.FindAsync(id);
        if (song == null) return NotFound();
        var isLiked = await _db.Likes.AnyAsync(l => l.UserId == userId && l.SongId == id);
        return Ok(ToDto(song, isLiked));
    }

    [HttpGet("genres")]
    public async Task<IActionResult> GetGenres()
    {
        var genres = await _db.Songs.Select(s => s.Genre).Distinct().ToListAsync();
        return Ok(genres);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Create([FromBody] CreateSongRequest req)
    {
        var song = new Song
        {
            Title = req.Title,
            Artist = req.Artist,
            Album = req.Album,
            Genre = req.Genre,
            CoverUrl = req.CoverUrl,
            AudioUrl = req.AudioUrl,
            Duration = req.Duration
        };
        _db.Songs.Add(song);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = song.Id }, ToDto(song, false));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSongRequest req)
    {
        var song = await _db.Songs.FindAsync(id);
        if (song == null) return NotFound();
        song.Title = req.Title;
        song.Artist = req.Artist;
        song.Album = req.Album;
        song.Genre = req.Genre;
        song.CoverUrl = req.CoverUrl;
        song.AudioUrl = req.AudioUrl;
        song.Duration = req.Duration;
        await _db.SaveChangesAsync();
        return Ok(ToDto(song, false));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var song = await _db.Songs.FindAsync(id);
        if (song == null) return NotFound();
        _db.Songs.Remove(song);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id}/play")]
    public async Task<IActionResult> RecordPlay(int id)
    {
        var userId = GetUserId();
        var song = await _db.Songs.FindAsync(id);
        if (song == null) return NotFound();
        _db.PlayHistories.Add(new PlayHistory { UserId = userId, SongId = id });
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("{id}/like")]
    public async Task<IActionResult> ToggleLike(int id)
    {
        var userId = GetUserId();
        var existing = await _db.Likes.FirstOrDefaultAsync(l => l.UserId == userId && l.SongId == id);
        if (existing != null)
        {
            _db.Likes.Remove(existing);
            await _db.SaveChangesAsync();
            return Ok(new { liked = false });
        }
        _db.Likes.Add(new Like { UserId = userId, SongId = id });
        await _db.SaveChangesAsync();
        return Ok(new { liked = true });
    }

    [HttpGet("liked")]
    public async Task<IActionResult> GetLiked()
    {
        var userId = GetUserId();
        var songs = await _db.Likes
            .Where(l => l.UserId == userId)
            .Include(l => l.Song)
            .Select(l => l.Song)
            .ToListAsync();
        return Ok(songs.Select(s => ToDto(s, true)));
    }

    private static SongDto ToDto(Song s, bool isLiked) =>
        new(s.Id, s.Title, s.Artist, s.Album, s.Genre, s.CoverUrl, s.AudioUrl, s.Duration, isLiked);
}
