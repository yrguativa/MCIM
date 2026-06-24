import ftplib, os
from pathlib import Path

host = os.environ.get("FTP_HOST", "")
user = os.environ.get("FTP_USER", "")
passwd = os.environ.get("FTP_PASS", "")
port = 21

host = host.strip()
if not host:
    print("ERROR: FTP_HOST esta vacio en GitHub Secrets")
    print("Ve a: GitHub > Settings > Secrets and variables > Actions")
    exit(1)
if not user:
    print("ERROR: FTP_USERNAME no esta configurado")
    exit(1)
if not passwd:
    print("ERROR: FTP_PASSWORD no esta configurado")
    exit(1)
if os.environ.get("FTP_PORT"):
    port = int(os.environ["FTP_PORT"])
timeout = 15

print(f"Conectando a {host}:{port}...")

try:
    ftp = ftplib.FTP()
    ftp.connect(host, port, timeout=timeout)
    ftp.login(user, passwd)
except Exception as e:
    print(f"  Error: {e}")
    print("  Intentando FTPS (TLS)...")
    try:
        ftp = ftplib.FTP_TLS()
        ftp.connect(host, port, timeout=timeout)
        ftp.login(user, passwd)
        ftp.prot_p()
    except Exception as e2:
        print(f"  FTP: {e}")
        print(f"  FTPS: {e2}")
        exit(1)

print("Autenticacion exitosa. Subiendo archivos...")

local_root = Path(os.environ.get("FTP_LOCAL_DIR", "./app/dist"))
remote_root = os.environ.get("FTP_REMOTE_DIR", "/").strip()
if not remote_root.startswith("/"):
    remote_root = "/" + remote_root
print(f"Directorio remoto: {remote_root}")

def upload_dir(ftp, local_path, remote_path):
    ftp.cwd(remote_path)
    for entry in local_path.iterdir():
        if entry.is_dir():
            try:
                ftp.mkd(entry.name)
            except:
                pass
            upload_dir(ftp, entry, entry.name)
            ftp.cwd("..")
        else:
            try:
                ftp.delete(entry.name)
            except:
                pass
            try:
                ftp.delete(f".in.{entry.name}")
            except:
                pass
            with open(entry, "rb") as f:
                ftp.storbinary(f"STOR {entry.name}", f)
                print(f"  Subido: {entry.relative_to(local_root)}")

try:
    ftp.mkd(remote_root)
except:
    pass
upload_dir(ftp, local_root, remote_root)
ftp.quit()
print("Publicacion FTP completada.")
