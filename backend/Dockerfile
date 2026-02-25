# Use official .NET 8 SDK image to build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and publish
COPY . ./
RUN dotnet publish -c Release -o out

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Expose port 10000 (Render uses this)
EXPOSE 10000

ENV ASPNETCORE_URLS=http://0.0.0.0:10000

ENTRYPOINT ["dotnet", "SpotifyApp.API.dll"]