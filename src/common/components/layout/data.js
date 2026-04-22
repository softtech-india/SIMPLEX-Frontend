export const menus = [
  { id: 1, text: 'Dashboard', icon: 'chart', path: '/dashboard', },
  { id: 2, text: 'Roles', icon: 'user', path: '/roles', },
  { id: 3, text: 'Menus', icon: 'user', path: '/menus', },
  { id: 4, text: 'Users', icon: 'user', path: '/users', },
  { id: 5, text: 'Priviledges', icon: 'user', path: '/priviledges', },
  { id: 6, text: 'Products', icon: 'product', path: '/products', },
  { id: 7, text: 'Sales', icon: 'money', path: '/sales', },
  { id: 8, text: 'Customers', icon: 'group', path: '/customers', },
  { id: 9, text: 'Employees', icon: 'card', path: '/employees', },
  { id: 10, text: 'Reports', icon: 'chart', path: '/reports', },
  { id: 11, text: 'Admin', icon: 'user', items: [
    {
      id: 12,
      text: 'Profile',
      icon: 'user',
      path: '/profile'
    }
  ], },
];

export const text = '<h2><b>Drawer Demo</b></h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Penatibus et magnis dis parturient. Eget dolor morbi non arcu risus. Tristique magna sit amet purus gravida quis blandit. Auctor urna nunc id cursus metus aliquam eleifend mi in. Tellus orci ac auctor augue mauris augue neque gravida. Nullam vehicula ipsum a arcu. Nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi. Cursus in hac habitasse platea dictumst. Egestas dui id ornare arcu. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim.</p><p>Mauris rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar. Neque volutpat ac tincidunt vitae semper quis lectus. Sed sed risus pretium quam vulputate dignissim suspendisse in. Urna nec tincidunt praesent semper feugiat nibh sed pulvinar. Ultricies lacus sed turpis tincidunt id aliquet risus feugiat. Amet cursus sit amet dictum sit amet justo donec enim. Vestibulum rhoncus est pellentesque elit ullamcorper. Id aliquet risus feugiat in ante metus dictum at.</p>';

const colors = [null, '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff', '#ff3466'];
const profileSettings = [
  { id: 1, name: 'Profile', icon: 'user' },
  {
    id: 4, name: 'Messages', icon: 'email', badge: '5',
  },
  { id: 2, name: 'Friends', icon: 'group' },
  { id: 3, name: 'Exit', icon: 'runner' },
];
const downloads = ['Download Trial For Visual Studio', 'Download Trial For All Platforms', 'Package Managers'];
const alignments = [
  { id: 1, name: 'Left', icon: 'alignleft' },
  { id: 4, name: 'Right', icon: 'alignright' },
  { id: 2, name: 'Center', icon: 'aligncenter' },
  { id: 3, name: 'Justify', icon: 'alignjustify' },
];
const fontSizes = [
  { size: 10, text: '10px' },
  { size: 12, text: '12px' },
  { size: 14, text: '14px' },
  { size: 16, text: '16px' },
  { size: 18, text: '18px' },
];
const lineHeights = [
  { lineHeight: 1, text: '1' },
  { lineHeight: 1.35, text: '1.35' },
  { lineHeight: 1.5, text: '1.5' },
  { lineHeight: 2, text: '2' },
];
export default {
  getData() {
    return {
      colors, profileSettings, downloads, alignments, fontSizes, lineHeights,
    };
  },
};
