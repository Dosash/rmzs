
# Help

Эта страница предназначена для работы со страницами проекта RMZS. Здесь находятся инструкции, рекомендации и справочная информация по управлению контентом сайта, редактированию страниц и поддержанию проекта в актуальном состоянии.


---


## Структура файлов для новой страницы

Для каждой новой страницы убедитесь, что в `<head>` указаны следующие файлы:

```html
<script src="../main.js" defer></script>
<link rel="stylesheet" href="../styles.css" />
```

Где:
- **main.js** — содержит всю функциональность (копирование IP, lightbox, год в футере, уведомления)
- **styles.css** — всё стилизирование и оформление сайта

Без этих файлов страница не будет корректно работать и выглядеть.


---


## Добавление видео на сайт

### Синтаксис добавления видео
Используйте следующий HTML для добавления YouTube видео с функцией приближения:

```html
<div class="youtube-video zoomable" data-video-id="VIDEO_ID">
    <img class="youtube-video__img" src="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg" alt="YouTube видео">
    <div class="youtube-video__play">
        <span class="youtube-video__play-icon">▶</span>
    </div>
</div>
```

### Параметры
- **data-video-id** — ID видео из YouTube ссылки (например, из `youtube.com/watch?v=U_DZTx8RWl4` берём `U_DZTx8RWl4`)
- **src** — миниатюра видео (автоматически подтягивается с YouTube)
- **alt** — описание видео для доступности
- **class="zoomable"** — обязателен для открытия видео в lightbox при клике

### Пример использования в гайде
```html
<div style="display: flex; gap: 14px; margin: 20px auto; flex-wrap: wrap; justify-content: center;">
    <div class="youtube-video zoomable" data-video-id="U_DZTx8RWl4">
        <img class="youtube-video__img" src="https://img.youtube.com/vi/U_DZTx8RWl4/maxresdefault.jpg" alt="Гайд видео">
        <div class="youtube-video__play">
            <span class="youtube-video__play-icon">▶</span>
        </div>
    </div>
</div>
```

### Советы
- Всегда добавляйте понятное описание в атрибут `alt`
- Используйте качество `maxresdefault.jpg` для лучшей миниатюры
- Видео можно комбинировать с изображениями в одном `flex` контейнере
- При клике на видео оно откроется в полноэкранном режиме с автоматическим воспроизведением


---


## Добавление изображений на сайт

### Структура папок
Все изображения хранятся в папке `images/`. Для каждого гайда или раздела создавайте отдельную подпапку:
```
images/
├── guide_record_demo/
│   ├── 1.png
│   ├── 2.png
│   └── 3.png
└── другой_раздел/
```

### Синтаксис добавления изображения
Используйте следующий HTML для добавления изображения с функцией приближения (zoom):

```html
<img src="../images/папка/имя_файла.png" class="zoomable" alt="Описание картинки" style="width: 200px; height: 200px;">
```

### Параметры
- **src** — путь к изображению (относительно текущей страницы)
- **class="zoomable"** — обязателен для функции приближения при клике
- **alt** — описание изображения для доступности
- **width / height** — размер изображения в пикселях

### Пример использования в гайде
```html
<div style="display: flex; gap: 14px; margin: 20px auto; flex-wrap: wrap; justify-content: center;">
    <img src="../images/guide_record_demo/1.png" class="zoomable" alt="Шаг 1" style="width: 200px; height: 200px;">
    <img src="../images/guide_record_demo/2.png" class="zoomable" alt="Шаг 2" style="width: 200px; height: 200px;">
</div>
```

### Советы
- Всегда добавляйте понятное описание в атрибут `alt`
- Используйте разумные размеры изображений (оптимальный размер контейнера 200-300px)
- Группируйте несколько изображений в `div` с `display: flex` для красивой компоновки
