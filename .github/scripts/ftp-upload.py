import ftplib, os
from pathlib import Path

host = os.environ["FTP_HOST"]
user = os.environ["FTP_USER"]
passwd = os.environ["FTP_PASS"]
port = 21
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

local_root = Path("./app/dist")
remote_root = "/"

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
            with open(entry, "rb") as f:
                ftp.storbinary(f"STOR {entry.name}", f)
                print(f"  Subido: {entry.relative_to(local_root)}")

upload_dir(ftp, local_root, remote_root)
ftp.quit()
print("Publicacion FTP completada.")
