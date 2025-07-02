import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
from werkzeug.utils import secure_filename

# 1) Get the directory where this script lives
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 2) Build absolute paths for uploads & sketches
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
OUTPUT_FOLDER = os.path.join(BASE_DIR, 'sketches')

# 3) Create them once, if needed
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/", methods=["GET"])
def health_check():
    return "✅ Sketchify API is up and running!", 200

@app.route('/sketch', methods=['POST'])
def sketch_image():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        filename = secure_filename(file.filename)
        input_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(input_path)

        img = cv2.imread(input_path)
        if img is None:
            return jsonify({'error': 'Invalid image file'}), 400

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        invert = cv2.bitwise_not(gray)
        blur = cv2.GaussianBlur(invert, (11, 11), 0)
        invert_blur = cv2.bitwise_not(blur)
        sketch = cv2.divide(gray, invert_blur, scale=256.0)

        output_filename = f"sketch_{filename}"
        output_path = os.path.join(OUTPUT_FOLDER, output_filename)
        cv2.imwrite(output_path, sketch)

        return send_file(output_path, mimetype='image/png')

    except Exception as e:
        app.logger.exception("Error in /sketch")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
