# Food Images - Unsplash Integration

## 🖼️ Real Food Images from Unsplash

All menu items and categories now feature **high-quality, professional food photography** from [Unsplash](https://unsplash.com/), a platform providing free-to-use images.

---

## 📸 Image Sources

### Why Unsplash?

✅ **Legal & Free**: All images are free to use under the Unsplash License  
✅ **High Quality**: Professional food photography  
✅ **No Attribution Required**: Can be used commercially  
✅ **Fast CDN**: Images served via Unsplash's global CDN  
✅ **Optimized**: URLs include quality and size parameters

### Image URL Format

All images use the following format:

```
https://images.unsplash.com/photo-{photo-id}?w=800&q=80
```

**Parameters**:

- `w=800` - Width of 800px (optimized for web)
- `q=80` - Quality at 80% (balance between quality and file size)

---

## 🍕 Menu Categories & Images

### 1. **Pizza** (5 items)

- **Category Image**: Classic pizza with melted cheese
- **Items**:
  - Margherita Pizza - Fresh tomatoes and mozzarella
  - Pepperoni Pizza - Loaded with pepperoni
  - Quattro Formaggi - Four cheese pizza
  - Hawaiian Pizza - Ham and pineapple
  - Veggie Supreme - Loaded with vegetables

### 2. **Burgers** (4 items)

- **Category Image**: Juicy burger with toppings
- **Items**:
  - Classic Cheeseburger - Traditional beef burger
  - Bacon Deluxe Burger - Double patty with bacon
  - Mushroom Swiss Burger - With sautéed mushrooms
  - Chicken Burger - Crispy chicken breast

### 3. **Pasta** (4 items)

- **Category Image**: Italian pasta dish
- **Items**:
  - Spaghetti Carbonara - Classic Roman pasta
  - Fettuccine Alfredo - Creamy parmesan sauce
  - Penne Arrabbiata - Spicy tomato sauce
  - Lasagna Bolognese - Layered pasta with meat sauce

### 4. **Salads** (3 items)

- **Category Image**: Fresh mixed salad
- **Items**:
  - Caesar Salad - Romaine with parmesan
  - Greek Salad - Feta, olives, and tomatoes
  - Caprese Salad - Mozzarella and tomatoes

### 5. **Drinks** (4 items)

- **Category Image**: Refreshing beverages
- **Items**:
  - Coca-Cola - Classic cola
  - Fresh Lemonade - Homemade with mint
  - Iced Coffee - Cold brew
  - Orange Juice - Freshly squeezed

### 6. **Desserts** (4 items)

- **Category Image**: Sweet desserts
- **Items**:
  - Tiramisu - Italian coffee dessert
  - Chocolate Lava Cake - Molten chocolate center
  - New York Cheesecake - Creamy cheesecake
  - Ice Cream Sundae - Three scoops with toppings

---

## 🔄 Updating Images

### To Change an Image

1. **Find a new image on Unsplash**:
   - Visit [Unsplash Food Collection](https://unsplash.com/s/photos/food)
   - Search for your specific food item
   - Copy the photo ID from the URL

2. **Update the seed file**:

   ```typescript
   imageUrl: "https://images.unsplash.com/photo-{PHOTO_ID}?w=800&q=80";
   ```

3. **Re-seed the database**:
   ```bash
   npm run db:seed
   ```

### Image Size Options

You can adjust the image size by changing the `w` parameter:

```typescript
// Small (400px) - for thumbnails
"?w=400&q=80";

// Medium (800px) - default, good for cards
"?w=800&q=80";

// Large (1200px) - for hero images
"?w=1200&q=80";

// Extra Large (1600px) - for full-screen
"?w=1600&q=80";
```

---

## 📊 Current Database

After seeding, the database contains:

- **6 Categories** with images
- **24 Menu Items** with images
- All images are from Unsplash
- All images are optimized (800px width, 80% quality)

---

## 🎨 Image Quality

### Optimization Settings

Current settings balance quality and performance:

| Parameter | Value | Purpose                             |
| --------- | ----- | ----------------------------------- |
| Width     | 800px | Optimal for most displays           |
| Quality   | 80%   | Good quality, reasonable file size  |
| Format    | Auto  | Unsplash serves WebP when supported |

### File Sizes

Approximate file sizes with current settings:

- **Category images**: ~50-100 KB each
- **Menu item images**: ~50-100 KB each
- **Total for all images**: ~2-3 MB

---

## 🌐 CDN & Performance

### Benefits of Unsplash CDN

✅ **Global Distribution**: Fast loading worldwide  
✅ **Automatic Optimization**: WebP for modern browsers  
✅ **Caching**: Images cached at edge locations  
✅ **Responsive**: Automatic image sizing  
✅ **Reliability**: 99.9% uptime

### Performance Tips

1. **Use appropriate sizes**: Don't request larger images than needed
2. **Lazy loading**: Implement lazy loading in the frontend
3. **Caching**: Browser caching is automatic
4. **Responsive images**: Use `srcset` for different screen sizes

---

## 📝 License Information

### Unsplash License

All images are used under the [Unsplash License](https://unsplash.com/license):

✅ Free to use  
✅ Commercial and non-commercial purposes  
✅ No permission needed  
✅ No attribution required (but appreciated)  
❌ Cannot be sold as-is  
❌ Cannot be used to create a competing service

---

## 🔍 Finding More Images

### Recommended Unsplash Collections

- [Food & Drink](https://unsplash.com/s/photos/food)
- [Pizza](https://unsplash.com/s/photos/pizza)
- [Burgers](https://unsplash.com/s/photos/burger)
- [Pasta](https://unsplash.com/s/photos/pasta)
- [Salad](https://unsplash.com/s/photos/salad)
- [Desserts](https://unsplash.com/s/photos/dessert)
- [Drinks](https://unsplash.com/s/photos/drinks)

### Search Tips

1. Use specific terms: "margherita pizza" vs "pizza"
2. Look for high-quality, well-lit photos
3. Choose images with good composition
4. Prefer images with solid backgrounds
5. Check the photo dimensions (landscape works best)

---

## 🚀 Alternative Image Sources

If you want to use different sources:

### 1. **Pexels**

- Similar to Unsplash
- Free stock photos
- URL format: `https://images.pexels.com/photos/{id}/...`

### 2. **Pixabay**

- Free images and videos
- No attribution required
- URL format: `https://pixabay.com/get/{id}/...`

### 3. **Custom Images**

- Upload to cloud storage (AWS S3, Cloudinary, etc.)
- Update imageUrl in seed file
- Ensure proper permissions and licensing

---

## ✅ Verification

To verify all images are working:

```bash
# Check menu items
curl "http://localhost:3000/api/menu" | jq '.data[] | {name, imageUrl}'

# Check categories
curl "http://localhost:3000/api/categories" | jq '.data[] | {name, imageUrl}'
```

All URLs should return valid Unsplash image links.

---

**Status**: ✅ All images updated with real food photography  
**Source**: Unsplash (Free, high-quality stock photos)  
**Total Images**: 30 (6 categories + 24 menu items)  
**License**: Unsplash License (Free to use)
