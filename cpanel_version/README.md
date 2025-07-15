# VALOMATE - cPanel Version

A modern, responsive Valorant team finder platform built for cPanel hosting with PHP and MySQL.

## 🚀 Quick Start

1. **Upload files** to your cPanel hosting
2. **Create MySQL database** in cPanel
3. **Update database.php** with your credentials
4. **Import install.sql** via phpMyAdmin
5. **Set up cron job** for automatic cleanup
6. **Visit your site** and start finding teammates!

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Tailwind CSS (CDN)
- **Backend:** PHP 7.4+
- **Database:** MySQL 5.7+
- **Hosting:** cPanel compatible

## 📁 File Structure

```
cpanel_version/
├── index.html              # Main page
├── database.php           # Database connection
├── install.sql           # Database schema
├── cleanup_cron.php      # Cron job script
├── api/                  # API endpoints
│   ├── games.php
│   ├── players.php
│   ├── delete_player.php
│   ├── cleanup.php
│   └── health.php
├── js/                   # JavaScript files
│   ├── app.js
│   └── form.js
└── docs/                 # Documentation
    └── KURULUM_TALIMATLARI.md
```

## ✨ Features

### Core Features
- **Player Management:** Add, list, and auto-remove players
- **Advanced Filtering:** By game mode, team size, microphone
- **Real-time Search:** Instant player search functionality
- **Lobby Code Copy:** One-click lobby code copying
- **Auto Cleanup:** Removes players after 30 minutes

### UI/UX Features
- **Modern Design:** Dark theme with Valorant aesthetics
- **Responsive Layout:** Works on desktop and mobile
- **Rank Visualization:** Visual rank badges and ranges
- **Toast Notifications:** User-friendly feedback
- **Loading States:** Smooth loading animations
- **Form Validation:** Multi-step form with validation

### Technical Features
- **PHP 7.4+ Compatible:** Modern PHP with PDO
- **Security:** SQL injection protection, XSS prevention
- **Performance:** Indexed database, efficient queries
- **Error Handling:** Comprehensive error management
- **CORS Support:** Cross-origin resource sharing

## 🔧 Installation

See [KURULUM_TALIMATLARI.md](KURULUM_TALIMATLARI.md) for detailed installation instructions in Turkish.

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Mobile Support

Fully responsive design optimized for:
- iOS Safari
- Android Chrome
- Mobile browsers

## 🔐 Security

- SQL injection protection via PDO prepared statements
- XSS prevention with proper output escaping
- CSRF protection for forms
- Input validation and sanitization
- Secure error handling

## 🚀 Performance

- Optimized database queries with proper indexing
- Efficient JavaScript with minimal dependencies
- CDN-loaded Tailwind CSS
- Automatic cleanup prevents database bloat
- Lazy loading for better performance

## 📊 Database Schema

### Players Table
- `id` - UUID primary key
- `username` - Player username
- `tag` - Player tag (with #)
- `lobby_code` - Game lobby code
- `game` - Game type (valorant)
- `min_rank` - Minimum rank requirement
- `max_rank` - Maximum rank requirement
- `looking_for` - Team size needed
- `game_mode` - Game mode preference
- `mic_enabled` - Microphone availability
- `created_at` - Timestamp

### Games Table
- `id` - UUID primary key
- `name` - Game name
- `slug` - URL-friendly name
- `icon` - Game icon
- `description` - Game description

## 🎮 Usage

1. **Homepage:** View active players and use filters
2. **Add Player:** Click the + button to add yourself
3. **Search:** Use the search bar to find specific players
4. **Filter:** Use dropdowns to filter by preferences
5. **Copy Code:** Click lobby codes to copy them

## 🔄 API Endpoints

- `GET /api/games.php` - Get available games
- `GET /api/players.php` - Get players with filters
- `POST /api/players.php` - Add new player
- `DELETE /api/delete_player.php` - Remove player
- `GET /api/cleanup.php` - Manual cleanup
- `GET /api/health.php` - Health check

## 🕐 Cron Job

The application includes automatic cleanup via cron job:
- **Frequency:** Every 5 minutes
- **Action:** Remove players older than 30 minutes
- **File:** `cleanup_cron.php`

## 🌟 Customization

### Styling
- Modify Tailwind classes for different themes
- Update colors in CSS custom properties
- Change animations and transitions

### Functionality
- Adjust cleanup time in `database.php`
- Add new game modes in form options
- Modify rank systems as needed

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database credentials
   - Verify user permissions
   - Confirm database exists

2. **500 Internal Server Error**
   - Check error logs
   - Verify file permissions
   - Ensure PHP 7.4+ is active

3. **API Not Working**
   - Check .htaccess rules
   - Verify API file permissions
   - Test endpoint directly

## 📈 Future Enhancements

- Player profiles with statistics
- Team formation suggestions
- Discord integration
- Advanced filtering options
- Player rating system
- Real-time chat integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Credits

- **Valorant Ranks:** Images from Riot Games
- **Profile Images:** Demo images from premate.gg
- **Icons:** Heroicons and Emoji
- **Styling:** Tailwind CSS

---

**Made with ❤️ for the Valorant community**

*This platform helps players find teammates quickly and efficiently, creating better gaming experiences for everyone.*