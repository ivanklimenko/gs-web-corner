### Для корректной работы стенда локально нужно развернуть https://ninja.local. Ну или любимое локальное название стенда поправить в package.json
### Для этого
[MAC]
brew install mkcert
### Затем в каталоге проекта создать каталог cert, перейти в него и выполнить
mkcert -install
mkcert ninja.local

### по хорошему в каталоге должны случиться 2 *.pem файла, там им и место!
yarn start


