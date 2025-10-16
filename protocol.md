## Version Numbering System

Metainfo Mapper uses a date-based build numbering system for tracking releases and updates:

### Build Number Format: `#MMDDYYx`

- **MM** = Month (01-12)
- **DD** = Day (01-31)  
- **YY** = Year (last two digits)
- **x** = Update letter (a, b, c, etc.) for multiple releases on the same date

### Examples:
- `#101625a` = October 16, 2025, first update of the day
- `#101625b` = October 16, 2025, second update of the day
- `#122501a` = December 25, 2025, first update of the day

### Semantic Versioning:
The project also uses semantic versioning (e.g., 1.6.0) for major feature releases:
- **Major.Minor.Patch** format
- Major version: Significant new features or breaking changes
- Minor version: New features, backwards compatible
- Patch version: Bug fixes and minor improvements

### For AI Coders:
When reviewing this codebase, the build number indicates when changes were made. The date format allows for easy chronological tracking of development progress and helps identify when specific features or fixes were implemented.

## Build Number Increment Protocol

**IMPORTANT:** When making changes to core files, the build number must be incremented in the specific files that were modified.

### Files That Require Build Number Updates:
- `index.html` - Update in owner info section (`Version #MMDDYYx`)
- `about.html` - Update in footer section (`Version #MMDDYYx`)
- `js/app.js` - Update in file header comment (`Build: #MMDDYYx`)
- `css/styles.css` - Update when modified (add if not present)

### Protocol Rules:
1. **Only increment build numbers in files that were actually changed**
2. **Don't update build numbers in unchanged files**
3. **This allows easy tracking of when specific files were last modified**
4. **Increment the letter (a→b→c) for multiple updates on the same date**

### Examples:
- **Change only index.html** → Update build number only in index.html
- **Change index.html + app.js** → Update build numbers in both files
- **Change styles.css** → Update build number in styles.css

### Current Build Number:
`#101625d` (October 16, 2025, fourth update - RTK Analysis feature and CSS cleanup)

This protocol ensures that by looking at the build number in any file, you can immediately see when that specific file was last modified, making development tracking much easier.