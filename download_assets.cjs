
const fs = require('fs');
const https = require('https');
const path = require('path');

const assets = [
    { name: 'animals.png', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6qV9tR8odP6EdfIhiYCtRIPGymFX-Ow2rh6rh5Jr7VV_hW_ew2e5HM34X4Tmm5Hn_GawDNKC1ESFJliKLxUYtu0IC892gjsMKho6tS-VA6HOAF5ZFQqnVaJy7NBjplNXmw9Qx5-qsNlkLibbodXkyOnvNKeqyKTDqWWMYXJ6CSqrA_RcwSOgm0xxDhuKu_YRqp6TPNcPaCkREMN1hNpOT2Rz6amcDVxf-pTTwSvqARHP2a5NRMnOtaAw_vl865zoGdJ1gzZOksb0A' },
    { name: 'family.png', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB6TANGBCPclWfHk9IGBMuYla_zLtMEc0dLs1kV_kydeeYQSvsMN7E4oPdZRuP4fcz0zAv5HC_nOvKJ6q3i4Y0CpG4mz6uC4SkHKIC8ecS9yYoWE3PfGzVpGcQzHhHcqQGjb4h193_NQEYMDqjPeWqoRbCaqscBRlFB_QJUjYqhWtTrN95yOI0Z6Pn9nkerz4Q0K_PT0RBRpupysR_avW7Yejhkh6UfcFnJ_RuzWxFK4niMb483rM4fxnQSWaxbiU9S22GFXouudII' },
    { name: 'daily_routines.png', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJWsj36WkpT8-GBDvZhrB88ROl69mn2qzyZYo5ii8C5Dph1X3nJf6xesIg5pSVLfvuvraH2HZXy1cq9IuuDCXkIyo-It4BalrqmLZfRRcpYeciwRwFg8FYPNJDX_2GTiz3wVYfOIQqB6tS4EMHfM7x0svzC8mKo9eQRi6VB030A0SuwMacYka66A7f28OzjVJKfcAanMnvuHoBICTJLsV_fOqE3LMP7Jbx49rR-4o56pqyHWyKxUkdI7FCWWnYle972WnO2dY-8WE8' },
    { name: 'my_house.png', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZrDG3dTA4ToJ2qZTlFXJoZQWxR1IiegRWi2VoWecrH7nCZWefTLv4t0uQ3_hFfGBagH09wWk1MU96kr8hhRbhRCFhyDd0H8rTSHBjoppqWoLPbxPymyIENyLwZ9gWjmSufJD8FyL7aoiF-g0tmyRMBwFDO5GaM6H5_U6TueLZqfmJdg2DjIGVh5V5xQg6c5ZohABWh8jpWwlOchm3d6Jm0rfsLRBb12w4D2o6SXzRkisBqj7ywzXD9EBzrY3ACE076mpl9FwHIYRD' },
    { name: 'avatar_default.png', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBo6VQfhTqs9PYoqN04OMfvHZfA9CHEt4CUjR_3EonYInRFS1UG8Q67LAigW_KajK7vH0TzgCsDL3ovgSgnLpQc03PMaDYbZHOuc7vHTA3ck64v29jNLK-jyjVaoY_nUHDbSdAh0_1EomB243I4YW-PuK4HItI_DGm8_JNNz-T9Ig3IjHcKPjcCEHsY1AbaCEF3FrCQLKTtJMyRSqPcMUCx40rKdeVu3e9lKQod4xOyKuzk0-OkkraQYhIzBcw-QNwmiF2C3-cGyFmL' },
    { name: 'hero_avatar.png', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAENY7W2ZLjFE5dt6rBLkkTYwoDNTKKq-qweCaDBCYXz5j5QLk2N4eLTNvUjIIqhmQdC-VUr2E8bORWvnHyj31umYK_6BSSwOO7MOV5BX4Pl-OyLR90iqYunAwL5uua2Y50yjfaWfuh7EleQ0Z-VfAkzsunWQGTGFpROoWM-qPkz25Oqj5QkTHlvLY2thOe-aUhYQ1dUFupTEac619fFNPl_ja5BsRgslndSq94clrnFWl77vz5raDDHyEV2Jp_XozMSl4TlW-hS98' }
];

const downloadDir = path.join(__dirname, 'public', 'assets', 'games', 'themes');

if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
}

assets.forEach(asset => {
    const file = fs.createWriteStream(path.join(downloadDir, asset.name));
    https.get(asset.url, function (response) {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${asset.name}`);
        });
    }).on('error', (err) => {
        fs.unlink(asset.name);
        console.error(`Error downloading ${asset.name}: ${err.message}`);
    });
});
