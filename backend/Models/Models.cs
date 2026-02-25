namespace SpotifyApp.API.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "user"; // "admin" or "user"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<PlayHistory> PlayHistories { get; set; } = new List<PlayHistory>();
    public ICollection<Playlist> Playlists { get; set; } = new List<Playlist>();
    public ICollection<Like> Likes { get; set; } = new List<Like>();
}

public class Song
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Artist { get; set; } = string.Empty;
    public string Album { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public string CoverUrl { get; set; } = string.Empty;
    public string AudioUrl { get; set; } = string.Empty;
    public int Duration { get; set; } // seconds
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<PlayHistory> PlayHistories { get; set; } = new List<PlayHistory>();
    public ICollection<PlaylistSong> PlaylistSongs { get; set; } = new List<PlaylistSong>();
    public ICollection<Like> Likes { get; set; } = new List<Like>();
}

public class PlayHistory
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int SongId { get; set; }
    public Song Song { get; set; } = null!;
    public DateTime PlayedAt { get; set; } = DateTime.UtcNow;
}

public class Playlist
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<PlaylistSong> PlaylistSongs { get; set; } = new List<PlaylistSong>();
}

public class PlaylistSong
{
    public int PlaylistId { get; set; }
    public Playlist Playlist { get; set; } = null!;
    public int SongId { get; set; }
    public Song Song { get; set; } = null!;
}

public class Like
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int SongId { get; set; }
    public Song Song { get; set; } = null!;
}
