# Python 3.13 Installation Fix

## Issue
If you encounter an error when installing dependencies with Python 3.13:
```
error: the configured Python interpreter version (3.13) is newer than PyO3's maximum supported version (3.12)
```

## Solution Options

### Option 1: Use Updated Pydantic (Recommended)
The requirements.txt has been updated to use `pydantic>=2.9.0` which has better Python 3.13 support.

```bash
cd backend/python
pip install -r requirements.txt
```

### Option 2: Set Environment Variable (If Option 1 doesn't work)
If you still encounter issues, you can set the compatibility flag:

```bash
cd backend/python
export PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1
pip install -r requirements.txt
```

### Option 3: Use Python 3.12 (Alternative)
If you prefer to use a fully supported Python version:

```bash
# Install Python 3.12 (using pyenv or homebrew)
pyenv install 3.12.0
pyenv local 3.12.0

# Or with homebrew
brew install python@3.12

# Create new virtual environment
cd backend/python
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Verify Installation

After installation, verify everything works:

```bash
python app.py
# Should start without errors on http://localhost:6000
```

## Notes

- Python 3.13 is very new and some packages may not have full support yet
- The `PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1` flag uses the stable ABI which should work but may have minor compatibility issues
- Python 3.12 is fully supported by all dependencies and is recommended for production

