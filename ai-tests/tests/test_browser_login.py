"""
Parkontrol - UI Tests Login (equivalente Cypress) usando Browser Use + Ollama
=============================================================================

Replica los 4 tests del describe('UI Tests - Login y Autenticación')
contra http://localhost:4200/login.

Requisitos:
    pip install browser-use
    playwright install chromium

    # Ollama corriendo local:
    ollama serve
    ollama pull qwen2.5:7b      # o llama3.1, mistral, etc.

Uso:
    python parkontrol_login_tests.py
    python parkontrol_login_tests.py --headful
    python parkontrol_login_tests.py --only 1 4
    BASE_URL=http://localhost:4200 OLLAMA_MODEL=qwen2.5:7b python parkontrol_login_tests.py

Notas:
- Usa selectores exactos del Cypress (formControlName="correo", etc.) en los goals.
- Cada test es un Agent independiente con verificación explícita de éxito/fallo.
- El "login" reutilizable se hace al inicio del Test 4. No hay cy.session() real
  porque cada Agent abre un browser context limpio, así que cada test es independiente.
"""

import asyncio
import argparse
import os
from browser_use import Agent, Browser
from browser_use.llm import ChatOllama

BASE_URL = os.getenv("BASE_URL", "http://localhost:4200")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen3")
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")

VALID_EMAIL = "juan@gmail.com"
VALID_PASSWORD = "Prueba123456"


def build_tests():
    return [
        {
            "id": 1,
            "name": "Test 1: Debería mostrar el formulario de login",
            "goal": f"""
Abre {BASE_URL}/login.
Verifica que sean VISIBLES los siguientes 3 elementos en la página:
  1. input con formControlName="correo"   (selector CSS: input[formControlName="correo"])
  2. input con formControlName="contrasena" (selector CSS: input[formControlName="contrasena"])
  3. botón submit (selector CSS: button[type="submit"])
NO interactúes con nada. Solo verifica que existan y estén visibles.
Al terminar responde EXACTAMENTE con una de estas dos líneas:
  PASS: formulario visible
  FAIL: <qué falta>
""".strip(),
        },
        {
            "id": 2,
            "name": "Test 2: Debería mostrar errores de validación",
            "goal": f"""
Abre {BASE_URL}/login.
1. Haz click en el input input[formControlName="correo"] y luego haz click fuera (blur) sin escribir nada.
2. Haz click en el input input[formControlName="contrasena"] y luego haz click fuera (blur) sin escribir nada.
3. Verifica que aparezcan en pantalla los textos EXACTOS:
   - "El correo es requerido"
   - "La contraseña es requerida"
Al terminar responde EXACTAMENTE con:
  PASS: ambos mensajes visibles
  FAIL: <qué mensaje falta>
""".strip(),
        },
        {
            "id": 3,
            "name": "Test 3: Debería rechazar credenciales inválidas",
            "goal": f"""
Abre {BASE_URL}/login.
1. En input[formControlName="correo"] escribe: fake@test.com
2. En input[formControlName="contrasena"] escribe: 123456
3. Haz click en button[type="submit"].
4. Verifica que aparezca un elemento con clase .mensaje-error visible en pantalla
   (cualquier texto de error de credenciales).
5. La URL debe seguir conteniendo /login.
Al terminar responde EXACTAMENTE con:
  PASS: error mostrado y sigue en /login
  FAIL: <qué pasó>
""".strip(),
        },
        {
            "id": 4,
            "name": "Test 4: Debería loguear exitosamente con credenciales válidas",
            "goal": f"""
Abre {BASE_URL}/login.
1. En input[formControlName="correo"] escribe: {VALID_EMAIL}
2. En input[formControlName="contrasena"] escribe: {VALID_PASSWORD}
3. Haz click en button[type="submit"].
4. Espera la redirección. Verifica que la URL final NO contenga "/login".
Al terminar responde EXACTAMENTE con:
  PASS: login OK, URL final = <pega la URL actual>
  FAIL: <qué pasó>
""".strip(),
        },
    ]


async def run_test(test, browser, llm):
    print(f"\n{'='*70}\n▶ {test['name']}\n{'='*70}")
    agent = Agent(
        task=test["goal"],
        llm=llm,
        browser=browser,
        use_vision=True,
    )
    history = await agent.run(max_steps=20)
    final = (history.final_result() or "").strip()
    ok = final.upper().startswith("PASS")
    print(f"   resultado modelo: {final[:200]}")
    print(f"   → {'✅ PASS' if ok else '❌ FAIL'}")
    return {"id": test["id"], "name": test["name"], "ok": ok, "final": final}


async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", nargs="*", type=int, help="IDs de tests a correr (1..4)")
    parser.add_argument("--headful", action="store_true")
    parser.add_argument("--model", default=OLLAMA_MODEL)
    args = parser.parse_args()

    tests = build_tests()
    if args.only:
        tests = [t for t in tests if t["id"] in args.only]

    llm = ChatOllama(model=args.model, host=OLLAMA_HOST)
    browser = Browser(headless=not args.headful)
    await browser.start()

    results = []
    try:
        for t in tests:
            try:
                results.append(await run_test(t, browser, llm))
            except Exception as e:
                print(f"   💥 EXC: {e}")
                results.append({"id": t["id"], "name": t["name"], "ok": False, "final": f"EXC: {e}"})
    finally:
        await browser.stop()

    print("\n" + "="*70 + "\nRESUMEN\n" + "="*70)
    for r in results:
        mark = "✅" if r["ok"] else "❌"
        print(f"{mark} [{r['id']}] {r['name']}")
    failed = [r for r in results if not r["ok"]]
    raise SystemExit(0 if not failed else 1)


if __name__ == "__main__":
    asyncio.run(main())
