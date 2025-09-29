#!/usr/bin/env python3
"""Utility script to serve the PPVG SPA for quick previews.

The script wraps ``python -m http.server`` behaviour but ensures the
application binds to ``0.0.0.0`` so it is reachable from port-forwarded
preview environments.  Run it from the repository root:

    python serve.py --port 8000

Then open http://localhost:8000/ in your browser.
"""
from __future__ import annotations

import argparse
import http.server
import os
import socket
import socketserver
from contextlib import closing

DEFAULT_PORT = 8000


class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Serve the PPVG web app")
    parser.add_argument(
        "--port",
        type=int,
        default=int(os.environ.get("PPVG_PREVIEW_PORT", DEFAULT_PORT)),
        help="Port to bind the development server to (default: %(default)s)",
    )
    return parser.parse_args()


def check_port_available(port: int) -> None:
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
        if sock.connect_ex(("0.0.0.0", port)) == 0:
            raise SystemExit(
                f"Port {port} is already in use. Choose another port with --port."
            )


def main() -> None:
    args = parse_args()
    check_port_available(args.port)

    handler = http.server.SimpleHTTPRequestHandler
    server = ThreadedHTTPServer(("0.0.0.0", args.port), handler)

    host = socket.gethostname()
    print("Serving PPVG app…")
    print(f"Local:   http://localhost:{args.port}/")
    print(f"Network: http://{host}:{args.port}/ (if accessible)")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server…")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
