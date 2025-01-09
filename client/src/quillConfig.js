import Quill from 'quill';

// Import Quill's size attributor
const Size = Quill.import('attributors/style/size');

// Whitelist the custom font sizes
Size.whitelist = ['20px', '22px', '26px', '34px', '40px', '46px'];

// Register the modified size globally
Quill.register(Size, true);
