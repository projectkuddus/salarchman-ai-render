#!/bin/bash

# Directory containing style thumbnails
STYLES_DIR="public/thumbnails/styles"
MAX_WIDTH=400

echo "Optimizing thumbnails in $STYLES_DIR..."

# Iterate over image files
find "$STYLES_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r img; do
  # Get current dimensions
  width=$(sips -g pixelWidth "$img" | tail -n 1 | awk '{print $2}')
  
  if [ "$width" -gt "$MAX_WIDTH" ]; then
    echo "Resizing $img (current width: $width)..."
    sips -Z "$MAX_WIDTH" "$img" --out "$img" > /dev/null
  else
    echo "Skipping $img (width: $width is within limit)."
  fi
done

echo "Thumbnail optimization complete."
