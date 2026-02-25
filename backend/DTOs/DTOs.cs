namespace SpotifyApp.API.DTOs;

public record LoginRequest(string Username, string Password);
public record LoginResponse(string Token, string Role, string Username, int UserId);

public record SongDto(int Id, string Title, string Artist, string Album, string Genre, string CoverUrl, string AudioUrl, int Duration, bool IsLiked = false);
public record CreateSongRequest(string Title, string Artist, string Album, string Genre, string CoverUrl, string AudioUrl, int Duration);
public record UpdateSongRequest(string Title, string Artist, string Album, string Genre, string CoverUrl, string AudioUrl, int Duration);

public record PlaylistDto(int Id, string Name, int UserId, List<SongDto> Songs);
public record CreatePlaylistRequest(string Name);

public record PlayHistoryDto(int Id, int SongId, string Title, string Artist, string CoverUrl, DateTime PlayedAt);

public record UserDto(int Id, string Username, string Role, DateTime CreatedAt);
