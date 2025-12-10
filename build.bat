@echo off
echo [BUILD] Iniciando generacion de .exe...

:: Intentar cerrar el programa si esta abierto
taskkill /F /IM "GeneradorFormulas.exe" 2>nul

:: Intentar eliminar el exe previo para asegurar que no este bloqueado
if exist "dist\GeneradorFormulas.exe" (
    del "dist\GeneradorFormulas.exe"
    if exist "dist\GeneradorFormulas.exe" (
        echo [WARNING] No se pudo eliminar 'dist\GeneradorFormulas.exe'.
        echo Se procedera a crear 'GeneradorFormulas_v2.exe' ignorando el archivo bloqueado.
    )
)

pyinstaller GeneradorFormulas.spec --clean --noconfirm
if %errorlevel% neq 0 (
    echo [ERROR] Fallo la generacion del .exe
    pause
    exit /b %errorlevel%
)
echo [EXITO] .exe generado correctamente en la carpeta dist/
