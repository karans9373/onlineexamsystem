import os
import re
from typing import List

from docx import Document
from pypdf import PdfReader


def extract_text_from_file(file_storage) -> str:
    filename = (file_storage.filename or "").lower()

    if filename.endswith(".pdf"):
        reader = PdfReader(file_storage.stream)
        return "\n".join((page.extract_text() or "") for page in reader.pages)

    if filename.endswith(".docx"):
        document = Document(file_storage.stream)
        return "\n".join(paragraph.text for paragraph in document.paragraphs)

    if filename.endswith(".txt") or filename.endswith(".doc"):
        return file_storage.stream.read().decode("utf-8", errors="ignore")

    raise ValueError("Unsupported file format. Please upload PDF, DOCX, DOC, or TXT.")


def _generate_arithmetic_options(answer: int) -> List[int]:
    return [answer, answer + 1, max(answer - 1, 0), answer + 2]


def _normalize_question_prompt(line: str) -> str:
    cleaned = re.sub(r"^\s*(q(?:uestion)?\s*\d+[\).\:-]*\s*|\d+[\).\:-]\s*)", "", line, flags=re.IGNORECASE)
    return cleaned.strip()


def parse_questions_from_text(text: str) -> List[dict]:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    questions = []
    current = None

    for line in lines:
        mcq_start = re.match(r"^(?:q(?:uestion)?\s*\d+[\).\:-]*\s*|\d+[\).\:-]\s*)?(.*\?)$", line, re.IGNORECASE)
        option_match = re.match(r"^[A-D][\).:-]\s*(.+)$", line, re.IGNORECASE)
        answer_match = re.match(r"^(?:answer|correct answer)\s*[:\-]\s*([A-D]|\d+)$", line, re.IGNORECASE)
        arithmetic_match = re.search(r"(\d+)\s*([+\-])\s*(\d+)", line)

        if arithmetic_match and not line.endswith("?"):
            left = int(arithmetic_match.group(1))
            operator = arithmetic_match.group(2)
            right = int(arithmetic_match.group(3))
            answer = left + right if operator == "+" else left - right
            questions.append(
                {
                    "prompt": f"What is {left} {operator} {right}?",
                    "options": _generate_arithmetic_options(answer),
                    "correctAnswer": answer,
                    "marks": 1,
                }
            )
            continue

        if mcq_start:
            if current and len(current["options"]) == 4:
                questions.append(current)
            current = {
                "prompt": _normalize_question_prompt(mcq_start.group(1)),
                "options": [],
                "correctAnswer": None,
                "marks": 1,
            }
            arithmetic_in_question = re.search(r"(\d+)\s*([+\-])\s*(\d+)", current["prompt"])
            if arithmetic_in_question:
                left = int(arithmetic_in_question.group(1))
                operator = arithmetic_in_question.group(2)
                right = int(arithmetic_in_question.group(3))
                answer = left + right if operator == "+" else left - right
                current["options"] = _generate_arithmetic_options(answer)
                current["correctAnswer"] = answer
            continue

        if option_match and current:
            option_text = option_match.group(1).strip()
            option_value = int(option_text) if option_text.isdigit() else option_text
            current["options"].append(option_value)
            continue

        if answer_match and current:
            raw_answer = answer_match.group(1).strip()
            if raw_answer.isdigit():
                current["correctAnswer"] = int(raw_answer)
            else:
                option_index = ord(raw_answer.upper()) - ord("A")
                if 0 <= option_index < len(current["options"]):
                    current["correctAnswer"] = current["options"][option_index]
            continue

    if current and current["prompt"]:
        if current["correctAnswer"] is None and len(current["options"]) == 4:
            current["correctAnswer"] = current["options"][0]
        if len(current["options"]) == 4:
            questions.append(current)

    if questions:
        return questions

    fallback_questions = []
    for line in lines:
        arithmetic_match = re.search(r"(\d+)\s*([+\-])\s*(\d+)", line)
        if arithmetic_match:
            left = int(arithmetic_match.group(1))
            operator = arithmetic_match.group(2)
            right = int(arithmetic_match.group(3))
            answer = left + right if operator == "+" else left - right
            fallback_questions.append(
                {
                    "prompt": f"What is {left} {operator} {right}?",
                    "options": _generate_arithmetic_options(answer),
                    "correctAnswer": answer,
                    "marks": 1,
                }
            )

    return fallback_questions
