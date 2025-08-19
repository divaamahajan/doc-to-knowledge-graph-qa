
import fitz  # PyMuPDF
from tqdm import tqdm
from PIL import Image, ImageEnhance, ImageFilter 
import logging
from utils.extract_text_from_image import extract_text_from_image


# Set up logging with minimal verbosity
logging.basicConfig(level=logging.ERROR)
# Suppress all HTTP logs
logging.getLogger("openai").setLevel(logging.ERROR)
logging.getLogger("httpx").setLevel(logging.ERROR)
logging.getLogger("httpcore").setLevel(logging.ERROR)
logging.getLogger("neo4j").setLevel(logging.ERROR)

logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)


def extract_text_from_pdf(pdf_path, languages=['eng']):
    """Enhanced PDF text extraction with better image handling"""
    statistics = {
        'total_pages': 0,
        'total_images': 0,
        'successful_ocr': 0,
        'failed_ocr': 0,
        'errors': []
    }

    try:
        logger.info(f"Starting text extraction from: {pdf_path}")

        # Open the PDF with higher resolution
        doc = fitz.open(pdf_path)
        statistics['total_pages'] = len(doc)
        full_text = []

        # Process each page
        for page_num in tqdm(range(len(doc)), desc="Processing pages"):
            try:
                page = doc[page_num]

                # Extract text directly from PDF
                text = page.get_text()
                if text.strip():
                    full_text.append(text)

                # Get images with higher resolution
                pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x resolution
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

                # Process images in the page
                image_list = page.get_images(full=True)
                statistics['total_images'] += len(image_list)

                for img_index, img_info in enumerate(image_list):
                    try:
                        xref = img_info[0]
                        base_image = doc.extract_image(xref)
                        image_bytes = base_image["image"]

                        # Extract text from image with multiple attempts
                        image_text = extract_text_from_image(image_bytes, languages)

                        if image_text:
                            statistics['successful_ocr'] += 1
                            full_text.append(
                                f"\n[Image Text (Page {page_num + 1}, Image {img_index + 1})]:\n{image_text}"
                            )
                        else:
                            statistics['failed_ocr'] += 1

                    except Exception as e:
                        statistics['failed_ocr'] += 1
                        error_msg = f"Error processing image {img_index} on page {page_num + 1}: {str(e)}"
                        statistics['errors'].append(error_msg)
                        logger.error(error_msg)

            except Exception as e:
                error_msg = f"Error processing page {page_num + 1}: {str(e)}"
                statistics['errors'].append(error_msg)
                logger.error(error_msg)
                continue

        # Combine all extracted text
        combined_text = ' '.join(full_text)

        # Basic text cleaning
        combined_text = combined_text.replace('\x00', '')  # Remove null bytes
        combined_text = ' '.join(combined_text.split())  # Normalize whitespace

        return combined_text, statistics

    except Exception as e:
        error_msg = f"Fatal error processing PDF: {str(e)}"
        statistics['errors'].append(error_msg)
        logger.error(error_msg)
        raise
