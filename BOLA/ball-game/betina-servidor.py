# 🎂 Servidor Python para o Jogo da Betina 🎂
import http.server
import socketserver
import os
import sys

PORT = 8080

class BetinaHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="src", **kwargs)
    
    def log_message(self, format, *args):
        print(f"📥 {format % args}")

def start_server():
    print("🎂" + "=" * 50)
    print("🎉" + " " * 15 + "JOGO DA BETINA" + " " * 15 + "🎉")  
    print("🎂" + "=" * 50)
    print()
    
    # Verifica se a pasta src existe
    if not os.path.exists("src"):
        print("❌ Pasta 'src' não encontrada!")
        print("💡 Execute este script na pasta do jogo")
        input("Pressione Enter para sair...")
        return
    
    if not os.path.exists("src/index.html"):
        print("❌ Arquivo 'src/index.html' não encontrado!")
        input("Pressione Enter para sair...")
        return
    
    print("✅ Arquivos do jogo encontrados!")
    print("🎮 Iniciando servidor...")
    print()
    
    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), BetinaHandler) as httpd:
            print("🎉 SERVIDOR FUNCIONANDO! 🎉")
            print()
            print("📍 Acesse o jogo em:")
            print(f"   🏠 Local:   http://localhost:{PORT}")
            print(f"   🌐 Público: http://177.93.155.178:{PORT}")
            print()
            print("🎁 Compartilhe o link público com todos!")
            print("🎂 Feliz Aniversário, Betina! 🎂")
            print()
            print("⏹️  Para parar: Ctrl + C")
            print("=" * 52)
            print()
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Servidor parado.")
    except OSError as e:
        if e.errno == 48 or e.errno == 10048:  # Address already in use
            print(f"❌ Porta {PORT} já está em uso!")
            print("💡 Feche outros programas e tente novamente.")
        else:
            print(f"❌ Erro: {e}")
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
    
    input("\nPressione Enter para sair...")

if __name__ == "__main__":
    start_server()
