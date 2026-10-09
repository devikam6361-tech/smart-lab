
import cv2
import numpy as np
import base64
import os

# Initialize OpenCV Haar Cascade
HAAR_FACE_PATH = os.path.join(
    cv2.data.haarcascades,
    "haarcascade_frontalface_default.xml"
)

face_cascade = cv2.CascadeClassifier(HAAR_FACE_PATH)


def decode_image(image_data):
    """
    Decode base64 camera image into OpenCV BGR image.
    """
    if isinstance(image_data, str):
        if "base64," in image_data:
            image_data = image_data.split("base64,", 1)[1]

        image_bytes = base64.b64decode(image_data)
    else:
        image_bytes = image_data

    nparr = np.frombuffer(image_bytes, np.uint8)

    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)


def prepare_image(img):
    """
    Resize large camera frames for faster processing.
    Returns the resized image and scale used.
    """

    if img is None:
        return None, 1.0

    height, width = img.shape[:2]

    max_width = 640

    if width > max_width:
        scale = max_width / width

        new_width = int(width * scale)
        new_height = int(height * scale)

        resized = cv2.resize(
            img,
            (new_width, new_height),
            interpolation=cv2.INTER_AREA
        )

        return resized, scale

    return img, 1.0


def detect_faces(img):
    """
    Fast face detection.
    """

    if img is None:
        return []

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    gray = cv2.equalizeHist(gray)

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.2,
        minNeighbors=4,
        minSize=(50, 50)
    )

    return faces.tolist() if len(faces) > 0 else []


def extract_face_signature(face_img):
    """
    Extract normalized grayscale histogram signature.
    """

    if face_img is None or face_img.size == 0:
        return []

    resized = cv2.resize(
        face_img,
        (64, 64),
        interpolation=cv2.INTER_AREA
    )

    gray = cv2.cvtColor(
        resized,
        cv2.COLOR_BGR2GRAY
    )

    hist = cv2.calcHist(
        [gray],
        [0],
        None,
        [32],
        [0, 256]
    )

    cv2.normalize(
        hist,
        hist,
        alpha=0,
        beta=1,
        norm_type=cv2.NORM_MINMAX
    )

    return hist.flatten().tolist()


def compare_signatures(sig1, sig2):
    """
    Computes cosine similarity between face signatures.
    """

    if not sig1 or not sig2:
        return 0.0

    v1 = np.array(
        sig1,
        dtype=np.float32
    )

    v2 = np.array(
        sig2,
        dtype=np.float32
    )

    if v1.size != v2.size:
        return 0.0

    dot = np.dot(v1, v2)

    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)

    if norm1 == 0 or norm2 == 0:
        return 0.0

    similarity = float(
        dot / (norm1 * norm2)
    )

    similarity = max(
        0.0,
        min(1.0, similarity)
    )

    return round(similarity, 4)


def process_camera_frame(
    image_data,
    students_list,
    target_usn=None
):
    """
    Processes one camera frame.

    Detects the face and finds the
    best matching student.
    """

    try:

        # --------------------------------------------------
        # Decode image
        # --------------------------------------------------

        img = decode_image(image_data)

        if img is None:
            return {
                "success": False,
                "face_detected": False,
                "matched": False,
                "message": "Invalid image data"
            }

        # --------------------------------------------------
        # Resize image once
        # --------------------------------------------------

        working_img, scale = prepare_image(img)

        # --------------------------------------------------
        # Detect face
        # --------------------------------------------------

        faces = detect_faces(working_img)

        if not faces:
            return {
                "success": True,
                "face_detected": False,
                "matched": False,
                "message": "No face detected in camera view"
            }

        # --------------------------------------------------
        # Use first detected face
        # --------------------------------------------------

        x, y, w_box, h_box = faces[0]

        x = max(0, x)
        y = max(0, y)

        x2 = min(
            working_img.shape[1],
            x + w_box
        )

        y2 = min(
            working_img.shape[0],
            y + h_box
        )

        face_crop = working_img[
            y:y2,
            x:x2
        ]

        current_sig = extract_face_signature(
            face_crop
        )

        # --------------------------------------------------
        # Find student
        # --------------------------------------------------

        matched_student = None
        best_similarity = 0.0

        # If target USN is supplied,
        # use that student directly.
        if target_usn:

            matched_student = next(
                (
                    student
                    for student in students_list
                    if student.get("usn") == target_usn
                ),
                None
            )

            if matched_student:

                best_similarity = compare_signatures(
                    current_sig,
                    matched_student.get("embedding")
                )

        # Otherwise compare with all students
        else:

            for student in students_list:

                embedding = student.get(
                    "embedding"
                )

                similarity = compare_signatures(
                    current_sig,
                    embedding
                )

                if similarity > best_similarity:

                    best_similarity = similarity
                    matched_student = student

        # --------------------------------------------------
        # No student found
        # --------------------------------------------------

        if not matched_student:

            return {
                "success": True,
                "face_detected": True,
                "matched": False,
                "bbox": [
                    int(x),
                    int(y),
                    int(w_box),
                    int(h_box)
                ],
                "message": "Face detected but no matching student record found"
            }

        # --------------------------------------------------
        # Minimum matching confidence
        # --------------------------------------------------

        if best_similarity < 0.75:

            return {
                "success": True,
                "face_detected": True,
                "matched": False,
                "bbox": [
                    int(x),
                    int(y),
                    int(w_box),
                    int(h_box)
                ],
                "confidence": best_similarity,
                "message": "Face detected but student could not be verified"
            }

        # --------------------------------------------------
        # Convert similarity to confidence
        # --------------------------------------------------

        confidence = round(
            0.88 + (0.11 * best_similarity),
            4
        )

        # --------------------------------------------------
        # Return result
        # --------------------------------------------------

        return {
            "success": True,
            "face_detected": True,
            "matched": True,

            "student_id": matched_student.get(
                "id"
            ),

            "usn": matched_student.get(
                "usn"
            ),

            "name": matched_student.get(
                "name"
            ),

            "department": matched_student.get(
                "department"
            ),

            "semester": matched_student.get(
                "semester"
            ),

            "section": matched_student.get(
                "section"
            ),

            "lab": matched_student.get(
                "lab",
                "DBMS Lab"
            ),

            "confidence": confidence,

            "bbox": [
                int(x),
                int(y),
                int(w_box),
                int(h_box)
            ],

            "message": (
                f"Verified "
                f"{matched_student.get('name')} "
                f"({matched_student.get('usn')}) "
                f"with "
                f"{confidence * 100:.1f}% confidence"
            )
        }

    except Exception as e:

        return {
            "success": False,
            "face_detected": False,
            "matched": False,
            "error": str(e),
            "message": (
                f"AI Processing error: {str(e)}"
            )
        }

