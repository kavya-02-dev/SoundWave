using Microsoft.EntityFrameworkCore;
using SpotifyApp.API.Models;

namespace SpotifyApp.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Song> Songs { get; set; }
    public DbSet<PlayHistory> PlayHistories { get; set; }
    public DbSet<Playlist> Playlists { get; set; }
    public DbSet<PlaylistSong> PlaylistSongs { get; set; }
    public DbSet<Like> Likes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PlaylistSong>()
            .HasKey(ps => new { ps.PlaylistId, ps.SongId });

        // Seed Users
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin"),
                Role = "admin",
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = 2,
                Username = "user",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("user"),
                Role = "user",
                CreatedAt = DateTime.UtcNow
            }
        );

        // Seed Songs from Free Music Archive / Jamendo open-source tracks
        modelBuilder.Entity<Song>().HasData(
            new Song
            {
                Id = 1,
                Title = "Acid Trumpet",
                Artist = "Kevin MacLeod",
                Album = "Incompetech",
                Genre = "Jazz",
                CoverUrl = "https://picsum.photos/seed/song1/300/300",
                AudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                Duration = 372,
                CreatedAt = DateTime.UtcNow
            },
            new Song
            {
                Id = 2,
                Title = "Ambient Guitar",
                Artist = "Blue Dot Sessions",
                Album = "Sessions Vol.1",
                Genre = "Ambient",
                CoverUrl = "https://picsum.photos/seed/song2/300/300",
                AudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                Duration = 295,
                CreatedAt = DateTime.UtcNow
            },
            new Song
            {
                Id = 3,
                Title = "Bright Future",
                Artist = "Bensound",
                Album = "Royalty Free",
                Genre = "Pop",
                CoverUrl = "https://picsum.photos/seed/song3/300/300",
                AudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                Duration = 210,
                CreatedAt = DateTime.UtcNow
            },
            new Song
            {
                Id = 4,
                Title = "Creative Minds",
                Artist = "Bensound",
                Album = "Royalty Free",
                Genre = "Electronic",
                CoverUrl = "https://picsum.photos/seed/song4/300/300",
                AudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                Duration = 248,
                CreatedAt = DateTime.UtcNow
            },
            new Song
            {
                Id = 5,
                Title = "Deep Blue",
                Artist = "Jahzzar",
                Album = "Traveller",
                Genre = "Chill",
                CoverUrl = "https://picsum.photos/seed/song5/300/300",
                AudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                Duration = 320,
                CreatedAt = DateTime.UtcNow
            },
            new Song
            {
                Id = 6,
                Title = "Electric Daydream",
                Artist = "Podington Bear",
                Album = "Podington Beats",
                Genre = "Indie",
                CoverUrl = "https://picsum.photos/seed/song6/300/300",
                AudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                Duration = 185,
                CreatedAt = DateTime.UtcNow
            },
            new Song
            {
                Id = 7,
                Title = "Floating Dream",
                Artist = "Kevin MacLeod",
                Album = "Incompetech",
                Genre = "Classical",
                CoverUrl = "https://picsum.photos/seed/song7/300/300",
                AudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                Duration = 267,
                CreatedAt = DateTime.UtcNow
            },
            new Song
            {
                Id = 8,
                Title = "Galaxy Run",
                Artist = "Audionautix",
                Album = "Space Tunes",
                Genre = "Electronic",
                CoverUrl = "https://picsum.photos/seed/song8/300/300",
                AudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                Duration = 198,
                CreatedAt = DateTime.UtcNow
            }
        );
    }
}
