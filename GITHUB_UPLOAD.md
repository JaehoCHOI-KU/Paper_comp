# GitHub 업로드 순서

## 1. 새 저장소 만들기

GitHub에서 새 저장소를 만들고 이름을 예를 들어 `mmu-research-mobile`로 지정합니다.

## 2. 이 폴더 업로드

`mmu-research-mobile` 폴더 안의 파일 전체를 저장소에 업로드합니다.

업로드할 파일:

- `index.html`
- `styles.css`
- `app.js`
- `manifest.json`
- `README.md`
- `.gitignore`
- `data/research-data.csv`

## 3. Pages 설정

저장소의 `Settings` > `Pages`에서 다음처럼 설정합니다.

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/root`

저장하면 잠시 뒤 `https://사용자명.github.io/저장소명/` 주소로 접속할 수 있습니다.

## 4. 데이터 확정 후 다시 업로드

대학알리미에서 확인한 실제 공시값으로 `data/research-data.csv`를 교체한 뒤 다시 업로드하면 앱 화면의 숫자가 바뀝니다.
