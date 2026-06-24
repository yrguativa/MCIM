import ftplib, os
from pathlib import Path

host = os.environ["FTP_HOST"]
user = os.environ["FTP_USER"]
passwd = os.environ["FTP_PASS"]

print(f"Conectando a {host}...")
ftp = ftplib.FTP(host, user, passwd, timeout=30)
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
