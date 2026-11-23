import os
import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageOps
from collections import deque
import scipy.ndimage as ndi

base_dir = '/Users/mac/.gemini/antigravity/scratch/little-idly'
downloaded = os.path.join(base_dir, 'assets', 'downloaded')
branding_dir = os.path.join(base_dir, 'assets', 'branding')
dishes_dir = os.path.join(base_dir, 'assets', 'dishes')

# 1. EXTRACT MASCOTS WITH TRANSPARENT BACKGROUND
def extract_mascot_from_card(card_fn, crop_box, bg_sample_pos, out_fn, tolerance=35):
    card_path = os.path.join(downloaded, card_fn)
    im = Image.open(card_path).convert('RGBA')
    crop_im = im.crop(crop_box)
    
    arr = np.array(crop_im, dtype=np.int32)
    h, w, _ = arr.shape
    
    # Background color sample
    bg_color = arr[bg_sample_pos[1], bg_sample_pos[0], :3]
    print(f'Extracting mascot from {card_fn}, bg color: {bg_color}')
    
    # BFS flood fill from edges to remove background color
    visited = np.zeros((h, w), dtype=bool)
    is_bg = np.zeros((h, w), dtype=bool)
    q = deque()
    
    # Seed edges
    for r in range(h):
        for c in (0, w-1):
            q.append((r, c))
            visited[r, c] = True
    for c in range(w):
        for r in (0, h-1):
            if not visited[r, c]:
                q.append((r, c))
                visited[r, c] = True
                
    while q:
        r, c = q.popleft()
        pix = arr[r, c, :3]
        # Check color distance to bg
        dist = np.linalg.norm(pix - bg_color)
        # Mascot outline is black / dark brown (pix is very dark)
        # If pix is similar to bg color, it's bg
        if dist < tolerance or (np.mean(pix) < 30 and dist < 70): # handle shadows near edge
            # But ensure we don't bleed into dark eyes if they're inside
            is_bg[r, c] = True
            for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < h and 0 <= nc < w and not visited[nr, nc]:
                    visited[nr, nc] = True
                    q.append((nr, nc))
                    
    fg_mask = ~is_bg
    # Fill small holes
    fg_mask = ndi.binary_fill_holes(fg_mask)
    
    alpha = (fg_mask * 255).astype(np.uint8)
    alpha_im = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(radius=0.8))
    
    crop_im.putalpha(alpha_im)
    crop_im.save(out_fn)
    print(f'Saved mascot: {out_fn}')

# Mascot 1: Trio (Idly, Vada, Dosa) from Menu-07.png
# crop: (630, 210, 920, 650)
extract_mascot_from_card(
    'img_27_%20Idly%20-%20Menu-07.png',
    (630, 215, 920, 650),
    (5, 5),
    os.path.join(branding_dir, 'mascot_trio.png'),
    tolerance=45
)

# Mascot 2: Steamed Idly with cape from Menu-04.png
extract_mascot_from_card(
    'img_24_%20Idly%20-%20Menu-04.png',
    (50, 150, 350, 560),
    (5, 5),
    os.path.join(branding_dir, 'mascot_idly.png'),
    tolerance=50
)

# Mascot 3: Kaapi glass from Menu-10.png
extract_mascot_from_card(
    'img_30_%20Idly%20-%20Menu-10.png',
    (450, 70, 670, 420),
    (5, 5),
    os.path.join(branding_dir, 'mascot_kaapi.png'),
    tolerance=45
)

# 2. PRODUCE CLEAN DISH CUTOUTS
def make_dish_cutout(dish_name, src_fn, crop_tight=None):
    src_path = os.path.join(dishes_dir, src_fn)
    if not os.path.exists(src_path):
        return
    im = Image.open(src_path).convert('RGB')
    arr = np.array(im, dtype=np.int32)
    h, w, _ = arr.shape
    
    # Border floodfill
    visited = np.zeros((h, w), dtype=bool)
    is_bg = np.zeros((h, w), dtype=bool)
    q = deque()
    
    for r in range(h):
        for c in (0, w-1):
            q.append((r, c))
            visited[r, c] = True
    for c in range(w):
        for r in (0, h-1):
            if not visited[r, c]:
                q.append((r, c))
                visited[r, c] = True
                
    while q:
        r, c = q.popleft()
        pix = arr[r, c]
        bri = np.mean(pix)
        
        is_dark_tray = (bri < 48) and (pix[0] < 55 and pix[1] < 55 and pix[2] < 55)
        is_food_color = (pix[0] > pix[2] + 40) or (pix[1] > pix[0] + 25)
        
        if not is_dark_tray and not is_food_color:
            is_bg[r, c] = True
            for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < h and 0 <= nc < w and not visited[nr, nc]:
                    visited[nr, nc] = True
                    q.append((nr, nc))
                    
    fg_mask = ~is_bg
    lbl, num = ndi.label(fg_mask)
    if num > 0:
        sizes = ndi.sum(fg_mask, lbl, range(1, num + 1))
        max_label = np.argmax(sizes) + 1
        fg_mask = (lbl == max_label)
        fg_mask = ndi.binary_fill_holes(fg_mask)
        
    alpha = (fg_mask * 255).astype(np.uint8)
    alpha_im = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(radius=1.2))
    
    rgba = im.convert('RGBA')
    rgba.putalpha(alpha_im)
    
    # Add soft drop shadow
    # Create canvas with padding for drop shadow
    pad = 30
    canvas_w = w + pad * 2
    canvas_h = h + pad * 2
    shadow_canvas = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
    
    # Make black shadow from alpha
    shadow_mask = alpha_im.filter(ImageFilter.GaussianBlur(radius=12))
    shadow_layer = Image.new('RGBA', (w, h), (0, 0, 0, 130))
    shadow_layer.putalpha(shadow_mask)
    
    # Paste shadow slightly offset
    shadow_canvas.paste(shadow_layer, (pad + 4, pad + 12), shadow_layer)
    # Paste dish
    shadow_canvas.paste(rgba, (pad, pad), rgba)
    
    out_path = os.path.join(dishes_dir, f'{dish_name}_cutout.png')
    shadow_canvas.save(out_path)
    print(f'Saved cutout dish: {out_path}')

make_dish_cutout('ghee_dosa', 'ghee_roast_dosa.jpg')
make_dish_cutout('podi_idly', 'guntur_podi_idly.jpg')
make_dish_cutout('idly_vada', 'idly_vada_set.jpg')
make_dish_cutout('idly_set', 'idly_set.jpg')
make_dish_cutout('mini_tiffin', 'mini_tiffin.jpg')
make_dish_cutout('plain_thatte_idly', 'plain_thatte_idly.jpg')

# 3. BUILD PRELOADER HALFTONE COLLAGE (1920x1080)
def build_halftone_collage():
    cw, ch = 1920, 1080
    # Cream background #FBF8F2
    collage = Image.new('RGBA', (cw, ch), (251, 248, 242, 255))
    draw = ImageDraw.Draw(collage)
    
    # Draw geometric retro blocks (terracotta #B85A1F, dark green #2C3E2D, vada orange #E08A2E, gold #F6C358)
    # Color blocks in background
    draw.polygon([(0, 0), (600, 0), (450, ch), (0, ch)], fill=(44, 62, 45, 230)) # Dark green band on left
    draw.polygon([(1350, 0), (cw, 0), (cw, ch), (1500, ch)], fill=(184, 90, 31, 220)) # Terracotta band on right
    draw.polygon([(450, 750), (1500, 750), (1450, ch), (400, ch)], fill=(224, 138, 46, 210)) # Vada orange bottom band
    draw.rectangle([550, 0, 1400, 120], fill=(246, 195, 88, 160)) # Gold top strip
    
    # Add dish cutouts into collage
    dosa = Image.open(os.path.join(dishes_dir, 'ghee_dosa_cutout.png')).resize((620, 620), Image.LANCZOS)
    idly = Image.open(os.path.join(dishes_dir, 'idly_set_cutout.png')).resize((500, 500), Image.LANCZOS)
    podi = Image.open(os.path.join(dishes_dir, 'podi_idly_cutout.png')).resize((480, 480), Image.LANCZOS)
    vada = Image.open(os.path.join(dishes_dir, 'idly_vada_cutout.png')).resize((520, 520), Image.LANCZOS)
    
    # Paste dishes symmetrically / dynamically
    collage.paste(dosa, (100, 240), dosa)
    collage.paste(vada, (1250, 240), vada)
    collage.paste(idly, (250, 580), idly)
    collage.paste(podi, (1150, 580), podi)
    
    # Generate halftone dot grid overlay
    dot_overlay = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    dot_draw = ImageDraw.Draw(dot_overlay)
    grid_size = 10
    for y in range(0, ch, grid_size):
        for x in range(0, cw, grid_size):
            # dot size varies slightly or subtle
            dot_r = 1.5 if (x + y) % (grid_size * 2) == 0 else 1.0
            dot_draw.ellipse([x - dot_r, y - dot_r, x + dot_r, y + dot_r], fill=(58, 31, 20, 32))
            
    collage = Image.alpha_composite(collage, dot_overlay)
    
    # Add slight vintage grain
    np_img = np.array(collage)
    noise = np.random.normal(0, 7, np_img.shape[:2]).astype(np.int16)
    for i in range(3):
        np_img[:, :, i] = np.clip(np_img[:, :, i].astype(np.int16) + noise, 0, 255).astype(np.uint8)
        
    final_collage = Image.fromarray(np_img).convert('RGB')
    out_path = os.path.join(branding_dir, 'preloader_halftone.jpg')
    final_collage.save(out_path, quality=92)
    print(f'Saved preloader halftone collage: {out_path}')

build_halftone_collage()
print('All visual processing complete!')
