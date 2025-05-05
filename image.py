import cv2
import numpy as np

def change_black_to_white(image_path, output_path):
    """
    Changes black color to white in an image.

    Args:
        image_path (str): Path to the input image.
        output_path (str): Path to save the modified image.
    """
    img = cv2.imread(image_path)

    if img is None:
        raise FileNotFoundError(f"Image not found at {image_path}")

    # Replace black pixels with white
    img[np.where((img == [0, 0, 0]).all(axis=2))] = [255, 255, 255]

    cv2.imwrite(output_path, img)

if __name__ == '__main__':
    image_path = 'homeicon.png'  # Replace with your image path
    output_path = 'homeicon1.png' # Replace with your desired output path
    change_black_to_white(image_path, output_path)
    print(f"Image saved to {output_path} with black color changed to white.")