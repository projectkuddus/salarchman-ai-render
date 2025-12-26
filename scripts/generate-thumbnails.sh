#!/bin/bash

# Directory containing gallery images
GALLERY_DIR="public/gallery"

# Max width for thumbnails
THUMB_WIDTH=600

echo "Generating thumbnails in $GALLERY_DIR..."

# Iterate over image files
find "$GALLERY_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) | while read -r img; do
  # Skip if it's already a thumbnail
  if [[ "$img" == *"_thumb"* ]]; then
    continue
  fi

  # Construct thumbnail filename
  extension="${img##*.}"
  filename="${img%.*}"
  thumb_name="${filename}_thumb.${extension}"

  # Check if thumbnail already exists
  if [ ! -f "$thumb_name" ]; then
    echo "Generating thumbnail for $img..."
    sips -Z "$THUMB_WIDTH" "$img" --out "$thumb_name" > /dev/null
  else
    echo "Thumbnail exists for $img, skipping."
  fi
done

echo "Thumbnail generation complete."
