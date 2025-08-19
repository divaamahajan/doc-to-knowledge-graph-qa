from tqdm import tqdm
from PIL import Image, ImageEnhance, ImageFilter 
import logging
from langchain.schema import Document
import pytesseract
import io
import numpy as np
import logging


# Set up logging with minimal verbosity
logging.basicConfig(level=logging.ERROR)
# Suppress all HTTP logs
logging.getLogger("openai").setLevel(logging.ERROR)
logging.getLogger("httpx").setLevel(logging.ERROR)
logging.getLogger("httpcore").setLevel(logging.ERROR)
logging.getLogger("neo4j").setLevel(logging.ERROR)

logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)


def preprocess_image(image):
    """Enhanced image preprocessing for better OCR results"""
    try:
        # Convert to RGB if image is in RGBA or other formats
        if image.mode == 'RGBA':
            image = image.convert('RGB')

        # Convert to grayscale
        image = image.convert('L')

        # Resize image if too small
        min_size = 1000
        if image.width < min_size or image.height < min_size:
            ratio = max(min_size/image.width, min_size/image.height)
            new_size = (int(image.width*ratio), int(image.height*ratio))
            image = image.resize(new_size, Image.Resampling.LANCZOS)

        # Enhance contrast
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(2)

        # Enhance sharpness
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(2)

        # Enhance brightness
        enhancer = ImageEnhance.Brightness(image)
        image = enhancer.enhance(1.5)

        # Apply adaptive thresholding
        from PIL import ImageFilter
        image = image.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))

        return image
    except Exception as e:
        logger.error(f"Error preprocessing image: {e}")
        return image


def extract_text_from_image(image_bytes, languages=['eng']):
    """Enhanced OCR function with better error handling and configuration"""
    try:
        # Convert image bytes to PIL Image
        image = Image.open(io.BytesIO(image_bytes))

        # Preprocess image
        processed_image = preprocess_image(image)

        # Configure Tesseract parameters
        custom_config = r'--oem 3 --psm 3 -c tessedit_char_whitelist="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%^&*()[]{}<>-_=+|/\\ "' 

        # Try different preprocessing approaches if initial OCR fails
        text = pytesseract.image_to_string(
            processed_image,
            lang='+'.join(languages),
            config=custom_config
        )

        if not text.strip():
            # Try with different preprocessing
            processed_image = processed_image.filter(ImageFilter.EDGE_ENHANCE)
            text = pytesseract.image_to_string(
                processed_image,
                lang='+'.join(languages),
                config=custom_config
            )

        if not text.strip():
            # Try with different PSM mode
            custom_config = r'--oem 3 --psm 6'  # Assume uniform block of text
            text = pytesseract.image_to_string(
                processed_image,
                lang='+'.join(languages),
                config=custom_config
            )

        text = text.strip()

        # Basic text cleaning
        if text:
            # Remove non-printable characters
            text = ''.join(char for char in text if char.isprintable())
            # Remove excessive whitespace
            text = ' '.join(text.split())
            # Remove very short lines (likely noise)
            text = '\n'.join(line for line in text.split('\n') if len(line.strip()) > 3)

        return text

    except Exception as e:
        logger.error(f"Error performing OCR: {e}")
        return ""

