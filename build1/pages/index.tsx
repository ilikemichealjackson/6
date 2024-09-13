import React, { useState, useEffect } from 'react';
import AudioPlayer from 'react-audio-player';
import styles from '../styles/Home.module.css';

// Sample songs data
const initialSongs = [
  { id: 1, title: 'mamas boyfriend', artist: 'Kanye West', url: '/music/song1.mp3', icon: '/icons/song1-icon.png' },
  { id: 2, title: 'Song 2', artist: 'Artist 2', url: '/music/song2.mp3', icon: '/icons/song2-icon.png' },
  { id: 3, title: 'Song 3', artist: 'Artist 3', url: '/music/song3.mp3', icon: '/icons/song3-icon.png' },
];

export default function Home() {
  const [songs, setSongs] = useState(initialSongs);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [playlists, setPlaylists] = useState<{ [key: string]: number[] }>({});
  const [currentBackground, setCurrentBackground] = useState('#f4f4f4');

  // Search functionality
  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load saved favorites and playlists from localStorage
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const savedPlaylists = JSON.parse(localStorage.getItem('playlists') || '{}');
    setFavorites(savedFavorites);
    setPlaylists(savedPlaylists);
  }, []);

  // Save favorites and playlists to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [favorites, playlists]);

  // Toggle favorites
  const toggleFavorite = (songId: number) => {
    setFavorites(prev => prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]);
  };

  // Add song to playlist
  const addToPlaylist = (playlistName: string, songId: number) => {
    setPlaylists(prev => ({
      ...prev,
      [playlistName]: prev[playlistName] ? [...prev[playlistName], songId] : [songId],
    }));
  };

  // Create a new playlist
  const createPlaylist = (newPlaylistName: string) => {
    if (!playlists[newPlaylistName]) {
      setPlaylists(prev => ({ ...prev, [newPlaylistName]: [] }));
    }
  };

  // Random background color patterns
  useEffect(() => {
    const colors = ['#ffeb3b', '#4caf50', '#ff5722', '#03a9f4', '#673ab7'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setCurrentBackground(randomColor);
  }, []);

  return (
    <div className={styles.container} style={{ backgroundColor: currentBackground }}>
      <h1 className={styles.title}>Music Streaming App</h1>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <img src="/icons/search.png" alt="Search" className={styles.icon} />
        <input
          type="text"
          placeholder="Search songs or artists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.songList}>
        {filteredSongs.map((song) => (
          <div key={song.id} className={styles.song}>
            <img src={song.icon} alt={song.title} className={styles.songIcon} />
            <h2>{song.title}</h2>
            <p>{song.artist}</p>

            {/* Audio Player */}
            <AudioPlayer src={song.url} controls className={styles.audioPlayer} />

            {/* Favorite Button */}
            <img
              src={favorites.includes(song.id) ? '/icons/heart-filled.png' : '/icons/heart.png'}
              alt="Favorite"
              className={styles.iconButton}
              onClick={() => toggleFavorite(song.id)}
            />

            {/* Playlist Dropdown */}
            <div className={styles.playlistContainer}>
              <img src="/icons/playlist.png" alt="Playlist" className={styles.iconButton} />
              <div className={styles.playlistDropdown}>
                <ul>
                  {Object.keys(playlists).map((playlistName) => (
                    <li key={playlistName} onClick={() => addToPlaylist(playlistName, song.id)}>
                      {playlistName}
                    </li>
                  ))}
                  <li>
                    <input
                      type="text"
                      placeholder="New playlist"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          createPlaylist(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
