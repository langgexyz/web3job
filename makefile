# Makefile to convert Markdown to PDF using Pandoc and WeasyPrint

# Define the input and output files
INPUT_FILE = resume.md
OUTPUT_FILE = resume(zero).pdf

# Define the PDF engine (weasyprint)
PDF_ENGINE = weasyprint

# Default target to create the PDF
all: $(OUTPUT_FILE)

$(OUTPUT_FILE): $(INPUT_FILE)
	@echo "Converting $(INPUT_FILE) to PDF using $(PDF_ENGINE)..."
	pandoc $(INPUT_FILE) -o $(OUTPUT_FILE) --pdf-engine=$(PDF_ENGINE)
	@echo "Conversion complete! Output saved as $(OUTPUT_FILE)."

# Clean up the generated files
clean:
	rm -f $(OUTPUT_FILE)
	@echo "Cleaned up $(OUTPUT_FILE)."

