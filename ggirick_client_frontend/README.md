# React 폴더 구조

* **App.jsx**
* **index.css**
* **main.tsx**
* **vite-env.d.ts**

---

## assets
* **assets/**

---

## commons

* **api/**

    * `apiInterceptor.js`
    * `apiRoutes.js`
* **components/**

    * `.gitkeep`
* **features/**

    * **nav/**

        * components/
        * pages/
    * **sideNav/**
        * components/
        * pages/
* **routes/**
* **store/**
* **utils/**

---

## domains

각 기능별 도메인 구조 (모두 동일한 서브 디렉터리 구조를 가짐):

* **address/**
* **approval/**
* **board/**
* **calendar/**
* **dashboard/**
* **drive**
* **mail/**
* **mypage/**
* **reservation/**
* **task/**
* **workmanagement/**

각 도메인은 아래와 같은 구조로 구성되어 있음:

```
├── api/
│   └── .gitkeep
├── components/
│   └── .gitkeep
├── hooks/
│   └── .gitkeep
├── pages/
│   └── .gitkeep
└── utils/
    └── .gitkeep
```
