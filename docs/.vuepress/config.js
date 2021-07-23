module.exports = {
    title: 'Kaysen\'s blog',
    description: 'Just playing around',
    themeConfig: {
        nav: [
            {text: '主页', link: '/'},
            {text: '学习笔记', link: '/note/'},
            {text: '备忘录', link: '/memo/'},
            {text: 'GitHub', link: 'https://github.com/kaysenyim/blog'}
        ],
        sidebarDepth: 3,
        displayAllHeaders: true,
        lastUpdated: '上次更新时间',
        sidebar: {
            '/note/': [
                {
                    title: '学习笔记',
                    collapsable: false,
                    children: [
                        '/note/spring-boot/spring-boot-starter-mail.md',
                    ],
                }
            ],
            '/memo/': [
                {
                    title: '备忘录',
                    collapsable: false,
                    children: [
                        '/memo/nginx.md',
                    ],
                }
            ],
        },
    },
    plugins: [
        ['@vuepress/back-to-top'],
        ['@vuepress/nprogress'],
        ['@vuepress/medium-zoom'],
        ['vuepress-plugin-code-copy', true],
        ['copyright', {
            noCopy: false,
            minLength: 100,
            authorName: 'kaysenyim',
            clipboardComponent: '.vuepress/components/clipboardComponent.vue',
        }],
        {
            name: 'page-plugin',
            // , 'notice'
            globalUIComponents: ['fixed'],
        },
    ],
  }