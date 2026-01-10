#!/usr/bin/env python3
"""
DorkNexus One-Click Installer and Launcher
Automatically sets up and runs DorkNexus Desktop Application
Works on Windows, macOS, and Linux
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

# Colors for terminal output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_header():
    """Print welcome header"""
    print(f"\n{Colors.CYAN}{'='*60}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.HEADER}🔍 DorkNexus Desktop - One-Click Installer{Colors.ENDC}")
    print(f"{Colors.CYAN}{'='*60}{Colors.ENDC}\n")

def print_step(step, total, message):
    """Print installation step"""
    print(f"{Colors.BLUE}[{step}/{total}]{Colors.ENDC} {message}")

def print_success(message):
    """Print success message"""
    print(f"{Colors.GREEN}✓{Colors.ENDC} {message}")

def print_error(message):
    """Print error message"""
    print(f"{Colors.FAIL}✗{Colors.ENDC} {message}")

def print_warning(message):
    """Print warning message"""
    print(f"{Colors.WARNING}⚠{Colors.ENDC} {message}")

def check_python_version():
    """Check if Python version is 3.8+"""
    print_step(1, 5, "Checking Python version...")

    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print_error(f"Python 3.8+ required. Current version: {version.major}.{version.minor}")
        print("\nPlease install Python 3.8 or newer from:")
        print("  https://www.python.org/downloads/")
        sys.exit(1)

    print_success(f"Python {version.major}.{version.minor}.{version.micro} detected")
    return True

def check_pip():
    """Check if pip is available"""
    print_step(2, 5, "Checking pip...")

    try:
        subprocess.run([sys.executable, '-m', 'pip', '--version'],
                      capture_output=True, check=True)
        print_success("pip is available")
        return True
    except subprocess.CalledProcessError:
        print_error("pip not found")
        print("\nPlease install pip:")
        print("  https://pip.pypa.io/en/stable/installation/")
        sys.exit(1)

def install_dependencies():
    """Install required dependencies"""
    print_step(3, 5, "Installing dependencies...")

    requirements_file = Path(__file__).parent / 'requirements.txt'

    if not requirements_file.exists():
        print_warning("requirements.txt not found, creating minimal requirements...")
        with open(requirements_file, 'w') as f:
            f.write("google-generativeai>=0.8.0\n")

    try:
        # Upgrade pip first
        print("  Upgrading pip...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', '--upgrade', 'pip'],
                      capture_output=True, check=True)

        # Install requirements
        print("  Installing packages...")
        result = subprocess.run(
            [sys.executable, '-m', 'pip', 'install', '-r', str(requirements_file)],
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            print_success("Dependencies installed successfully")
            return True
        else:
            print_error("Failed to install dependencies")
            print(result.stderr)
            return False

    except Exception as e:
        print_error(f"Installation failed: {e}")
        return False

def create_launcher_scripts():
    """Create platform-specific launcher scripts"""
    print_step(4, 5, "Creating launcher scripts...")

    app_dir = Path(__file__).parent

    # Windows batch file
    windows_launcher = app_dir / 'DorkNexus.bat'
    with open(windows_launcher, 'w') as f:
        f.write('@echo off\n')
        f.write('echo Starting DorkNexus...\n')
        f.write(f'"{sys.executable}" "{app_dir / "dorknexus_app.py"}"\n')
        f.write('pause\n')

    # Unix shell script (macOS/Linux)
    unix_launcher = app_dir / 'DorkNexus.sh'
    with open(unix_launcher, 'w') as f:
        f.write('#!/bin/bash\n')
        f.write('echo "Starting DorkNexus..."\n')
        f.write(f'"{sys.executable}" "{app_dir / "dorknexus_app.py"}"\n')

    # Make shell script executable on Unix systems
    if platform.system() != 'Windows':
        os.chmod(unix_launcher, 0o755)

    # Python launcher (cross-platform)
    python_launcher = app_dir / 'run_dorknexus.py'
    with open(python_launcher, 'w') as f:
        f.write('#!/usr/bin/env python3\n')
        f.write('import subprocess\n')
        f.write('import sys\n')
        f.write('from pathlib import Path\n\n')
        f.write('app_path = Path(__file__).parent / "dorknexus_app.py"\n')
        f.write('subprocess.run([sys.executable, str(app_path)])\n')

    print_success("Launcher scripts created")
    print(f"  • Windows: {windows_launcher.name}")
    print(f"  • macOS/Linux: {unix_launcher.name}")
    print(f"  • Python: {python_launcher.name}")

    return True

def verify_installation():
    """Verify that all files are in place"""
    print_step(5, 5, "Verifying installation...")

    app_dir = Path(__file__).parent
    required_files = ['dorknexus_app.py', 'requirements.txt']

    missing_files = []
    for file in required_files:
        if not (app_dir / file).exists():
            missing_files.append(file)

    if missing_files:
        print_error(f"Missing files: {', '.join(missing_files)}")
        return False

    print_success("Installation verified")
    return True

def launch_app():
    """Launch the DorkNexus application"""
    print(f"\n{Colors.CYAN}{'='*60}{Colors.ENDC}")
    print(f"{Colors.GREEN}{Colors.BOLD}Installation Complete!{Colors.ENDC}")
    print(f"{Colors.CYAN}{'='*60}{Colors.ENDC}\n")

    print("Launching DorkNexus...\n")

    app_path = Path(__file__).parent / 'dorknexus_app.py'

    try:
        subprocess.run([sys.executable, str(app_path)])
    except KeyboardInterrupt:
        print("\n\nApplication closed.")
    except Exception as e:
        print_error(f"Failed to launch application: {e}")
        sys.exit(1)

def show_manual_instructions():
    """Show manual launch instructions"""
    print(f"\n{Colors.CYAN}{'='*60}{Colors.ENDC}")
    print(f"{Colors.BOLD}Manual Launch Instructions:{Colors.ENDC}")
    print(f"{Colors.CYAN}{'='*60}{Colors.ENDC}\n")

    system = platform.system()
    app_dir = Path(__file__).parent

    if system == 'Windows':
        print(f"Double-click: {Colors.GREEN}DorkNexus.bat{Colors.ENDC}")
        print(f"Or run: {Colors.GREEN}python dorknexus_app.py{Colors.ENDC}")
    else:
        print(f"Run: {Colors.GREEN}./DorkNexus.sh{Colors.ENDC}")
        print(f"Or: {Colors.GREEN}python3 dorknexus_app.py{Colors.ENDC}")

    print()

def main():
    """Main installation flow"""
    print_header()

    print(f"Detected OS: {Colors.BOLD}{platform.system()} {platform.release()}{Colors.ENDC}\n")

    # Installation steps
    steps = [
        check_python_version,
        check_pip,
        install_dependencies,
        create_launcher_scripts,
        verify_installation
    ]

    for step in steps:
        if not step():
            print_error("\nInstallation failed!")
            sys.exit(1)
        print()

    # Launch the app
    try:
        launch_app()
    except Exception as e:
        print_error(f"Could not auto-launch: {e}")
        show_manual_instructions()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.WARNING}Installation cancelled by user.{Colors.ENDC}")
        sys.exit(0)
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        sys.exit(1)
