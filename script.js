document.addEventListener('DOMContentLoaded', function() {
//-------------------------------------------------------------

    const featureSearchInput = document.getElementById('feature-search-input');
    const qrCodeTextInput = document.getElementById('qrcode-text-input');
    const qrCodeDisplayArea = document.getElementById('qrcode-display-area');
    const qrCodeCanvas = document.getElementById('qrcode-canvas');
    const qrCodePlaceholder = document.getElementById('qrcode-placeholder');
    const downloadQrCodeButton = document.getElementById('download-qrcode-button');
    const qrCodeFileInput = document.getElementById('qrcode-file-input');
    const apiStatusPage = document.getElementById('api-status-page');
    const apiStatusListArea = document.getElementById('api-status-list-area');
    const refreshApiStatusButton = document.getElementById('refresh-api-status-button');
    
    
    // Elemen untuk Pemindai QR
    const qrScannerPage = document.getElementById('qr-scanner-page'),
          qrCameraReader = document.getElementById('qr-camera-reader'),
          startScanButton = document.getElementById('start-scan-button'),
          stopScanButton = document.getElementById('stop-scan-button'),
          qrFileInput = document.getElementById('qr-file-input'),
          qrScannerResultArea = document.getElementById('qr-scanner-result-area');

    let html5QrCode = null; // Variabel global untuk menyimpan instance scanner
    
    // Elemen untuk Kompresor Gambar
    const compressorFileInput = document.getElementById('compressor-file-input'),
          compressorUrlInput = document.getElementById('compressor-url-input'),
          compressorUrlButton = document.getElementById('compressor-url-button'),
          compressorOptions = document.getElementById('compressor-options'),
          compressorFormatSelect = document.getElementById('compressor-format-select'),
          qualitySliderContainer = document.getElementById('quality-slider-container'),
          compressorQualitySlider = document.getElementById('compressor-quality-slider'),
          qualitySliderValue = document.getElementById('quality-slider-value'),
          compressorResultArea = document.getElementById('compressor-result-area');
    
    let originalImageSrc = null; // Variabel untuk menyimpan gambar asli
    
    const textGeneratorInput = document.getElementById('text-generator-input');
const textGeneratorResultArea = document.getElementById('text-generator-result-area');

// 'Kamus' untuk mengubah huruf biasa ke huruf unik
const fontMaps = {
    'bold': { 'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇', 'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭' },
    'italic': { 'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻', 'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡' },
    'cursive': { 'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': '𝑒', 'f': '𝒻', 'g': '𝑔', 'h': '𝒽', 'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': '𝑜', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍', 'y': '𝓎', 'z': '𝓏', 'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵' },
    'fraktur': { 'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥', 'i': '𝔦', 'j': '𝔧', 'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭', 'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱', 'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵', 'y': '𝔶', 'z': '𝔷', 'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉', 'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ', 'J': '𝔍', 'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑', 'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': 'ℜ', 'S': '𝔖', 'T': '𝔗', 'U': '𝔘', 'V': '𝔙', 'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': 'ℨ' },
    'monospace': { 'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣', 'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉' },
    'bold-italic': { 'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯', 'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈', 'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕' },
'bubble': { 'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ', 'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ', 'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ' },
'wide': { 'a': 'ａ', 'b': 'ｂ', 'c': 'ｃ', 'd': 'ｄ', 'e': 'ｅ', 'f': 'ｆ', 'g': 'ｇ', 'h': 'ｈ', 'i': 'ｉ', 'j': 'ｊ', 'k': 'ｋ', 'l': 'ｌ', 'm': 'ｍ', 'n': 'ｎ', 'o': 'ｏ', 'p': 'ｐ', 'q': 'ｑ', 'r': 'ｒ', 's': 'ｓ', 't': 'ｔ', 'u': 'ｕ', 'v': 'ｖ', 'w': 'ｗ', 'x': 'ｘ', 'y': 'ｙ', 'z': 'ｚ', 'A': 'Ａ', 'B': 'Ｂ', 'C': 'Ｃ', 'D': 'Ｄ', 'E': 'Ｅ', 'F': 'Ｆ', 'G': 'Ｇ', 'H': 'Ｈ', 'I': 'Ｉ', 'J': 'Ｊ', 'K': 'Ｋ', 'L': 'Ｌ', 'M': 'Ｍ', 'N': 'Ｎ', 'O': 'Ｏ', 'P': 'Ｐ', 'Q': 'Ｑ', 'R': 'Ｒ', 'S': 'Ｓ', 'T': 'Ｔ', 'U': 'Ｕ', 'V': 'Ｖ', 'W': 'Ｗ', 'X': 'Ｘ', 'Y': 'Ｙ', 'Z': 'Ｚ' },
// Tambahkan peta-peta baru ini di dalam const fontMaps
'bold-italic': { 'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯', 'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈', 'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕' },
'boldCursive': { 'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱', 'i': '𝓲', 'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹', 'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃', 'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗', 'I': '𝓘', 'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟', 'Q': '𝓠', 'R': '𝓡', 'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩' },
'boldFraktur': { 'a': '𝖆', 'b': '𝖇', 'c': '𝖈', 'd': '𝖉', 'e': '𝖊', 'f': '𝖋', 'g': '𝖌', 'h': '𝖍', 'i': '𝖎', 'j': '𝖏', 'k': '𝖐', 'l': '𝖑', 'm': '𝖒', 'n': '𝖓', 'o': '𝖔', 'p': '𝖕', 'q': '𝖖', 'r': '𝖗', 's': '𝖘', 't': '𝖙', 'u': '𝖚', 'v': '𝖛', 'w': '𝖜', 'x': '𝖝', 'y': '𝖞', 'z': '𝖟', 'A': '𝕬', 'B': '𝕭', 'C': '𝕮', 'D': '𝕯', 'E': '𝕰', 'F': '𝕱', 'G': '𝕲', 'H': '𝕳', 'I': '𝕴', 'J': '𝕵', 'K': '𝕶', 'L': '𝕷', 'M': '𝕸', 'N': '𝕹', 'O': '𝕺', 'P': '𝕻', 'Q': '𝕼', 'R': '𝕽', 'S': '𝕾', 'T': '𝕿', 'U': '𝖀', 'V': '𝖁', 'W': '𝖂', 'X': '𝖃', 'Y': '𝖄', 'Z': '𝖅' },
'bubble': { 'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ', 'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ', 'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ' },
'wide': { 'a': 'ａ', 'b': 'ｂ', 'c': 'ｃ', 'd': 'ｄ', 'e': 'ｅ', 'f': 'ｆ', 'g': 'ｇ', 'h': 'ｈ', 'i': 'ｉ', 'j': 'ｊ', 'k': 'ｋ', 'l': 'ｌ', 'm': 'ｍ', 'n': 'ｎ', 'o': 'ｏ', 'p': 'ｐ', 'q': 'ｑ', 'r': 'ｒ', 's': 'ｓ', 't': 'ｔ', 'u': 'ｕ', 'v': 'ｖ', 'w': 'ｗ', 'x': 'ｘ', 'y': 'ｙ', 'z': 'ｚ', 'A': 'Ａ', 'B': 'Ｂ', 'C': 'Ｃ', 'D': 'Ｄ', 'E': 'Ｅ', 'F': 'Ｆ', 'G': 'Ｇ', 'H': 'Ｈ', 'I': 'Ｉ', 'J': 'Ｊ', 'K': 'Ｋ', 'L': 'Ｌ', 'M': 'Ｍ', 'N': 'Ｎ', 'O': 'Ｏ', 'P': 'Ｐ', 'Q': 'Ｑ', 'R': 'Ｒ', 'S': 'Ｓ', 'T': 'Ｔ', 'U': 'Ｕ', 'V': 'Ｖ', 'W': 'Ｗ', 'X': 'Ｘ', 'Y': 'Ｙ', 'Z': 'Ｚ' },
'squared': { 'a': '🄰', 'b': '🄱', 'c': '🄲', 'd': '🄳', 'e': '🄴', 'f': '🄵', 'g': '🄶', 'h': '🄷', 'i': '🄸', 'j': '🄹', 'k': '🄺', 'l': '🄻', 'm': '🄼', 'n': '🄽', 'o': '🄾', 'p': '🄿', 'q': '🅀', 'r': '🅁', 's': '🅂', 't': '🅃', 'u': '🅄', 'v': '🅅', 'w': '🅆', 'x': '🅇', 'y': '🅈', 'z': '🅉', 'A': '🄰', 'B': '🄱', 'C': '🄲', 'D': '🄳', 'E': '🄴', 'F': '🄵', 'G': '🄶', 'H': '🄷', 'I': '🄸', 'J': '🄹', 'K': '🄺', 'L': '🄻', 'M': '🄼', 'N': '🄽', 'O': '🄾', 'P': '🄿', 'Q': '🅀', 'R': '🅁', 'S': '🅂', 'T': '🅃', 'U': '🅄', 'V': '🅅', 'W': '🅆', 'X': '🅇', 'Y': '🅈', 'Z': '🅉' },
'upsideDown': { 'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ı', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z', 'A': '∀', 'B': '𐐒', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': '⅁', 'H': 'H', 'I': 'I', 'J': 'ſ', 'K': '⋊', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'Q', 'R': 'R', 'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z' }
};

// GANTI DAFTAR LAMA DENGAN DAFTAR BARU YANG LEBIH LENGKAP INI
const styles = [
    // --- Gaya Sans-Serif ---
    { name: 'Tebal', map: fontMaps.bold },
    { name: 'Miring', map: fontMaps.italic },
    { name: 'Tebal Miring', map: fontMaps['bold-italic'] },
    // --- Gaya Script ---
    { name: 'Cursive', map: fontMaps.cursive },
    { name: 'Cursive Tebal', map: fontMaps.boldCursive },
    // --- Gaya Gothic / Fraktur ---
    { name: 'Gothic', map: fontMaps.fraktur },
    { name: 'Gothic Tebal', map: fontMaps.boldFraktur },
    // --- Gaya Unik & Lainnya ---
    { name: 'Monospace', map: fontMaps.monospace },
    { name: 'Bubble', map: fontMaps.bubble },
    { name: 'Squared', map: fontMaps.squared },
    { name: 'Wide (Vaporwave)', map: fontMaps.wide },
    // --- Gaya Spesial (Logika Berbeda) ---
    { name: 'Coret Tengah', special: 'strikethrough' },
    { name: 'Terbalik', special: 'upside-down' }
];
    
    const igUsernameInput = document.getElementById('ig-username-input'),
          fetchIgProfilePicButton = document.getElementById('fetch-ig-profile-pic-button'),
          igProfilePicResultArea = document.getElementById('ig-profile-pic-result-area');
    const audioConverterInput = document.getElementById('audio-converter-input'),
          audioFormatSelect = document.getElementById('audio-format-select'),
          audioConverterResultArea = document.getElementById('audio-converter-result-area');
    const imageConverterInput = document.getElementById('image-converter-input'),
          imageFormatSelect = document.getElementById('image-format-select'),
          imageConverterResultArea = document.getElementById('image-converter-result-area');
    const webToPdfUrlInput = document.getElementById('web-to-pdf-url-input'),
          fetchWebToPdfButton = document.getElementById('fetch-web-to-pdf-button'),
          webToPdfResultArea = document.getElementById('web-to-pdf-result-area');

    const mainHubPage = document.getElementById('main-hub-page');
    const allContentPages = document.querySelectorAll('.page');
    const backButtons = document.querySelectorAll('.back-button');
    const API_BASE_URL = 'https://flowfalcon.dpdns.org';
    const IMGBB_API_KEY = '222d2bdbc4e4126bcabd5d0b4857d04d';

    const themeToggleButton = document.getElementById('theme-toggle-button');
    const themeIcon = document.getElementById('theme-icon');
    const showHistoryButton = document.getElementById('show-history-button');
    const showSettingsButton = document.getElementById('show-settings-button');
    const showQueueButton = document.getElementById('show-queue-button');

    const settingsPage = document.getElementById('settings-page');
    const themeToggleSwitch = document.getElementById('theme-toggle-switch');
    const resultsPerPageInput = document.getElementById('results-per-page-input');
    const clearApiCacheButton = document.getElementById('clear-api-cache-button');
    const clearHistorySettingsButton = document.getElementById('clear-history-settings-button');

    const historyPage = document.getElementById('history-page');
    const historyListArea = document.getElementById('history-list-area');
    const clearHistoryButton = document.getElementById('clear-history-button');

    // TAMBAHKAN INI BERSAMA const LAINNYA
    const openAiPromptInput = document.getElementById('openai-prompt-input'), fetchOpenAiButton = document.getElementById('fetch-openai-button'), openAiResultArea = document.getElementById('openai-result-area');
    const multiModelPromptInput = document.getElementById('multimodel-prompt-input'), multiModelSelect = document.getElementById('multimodel-select'), fetchMultiModelButton = document.getElementById('fetch-multimodel-button'), multiModelResultArea = document.getElementById('multimodel-result-area');

    const queuePage = document.getElementById('queue-page');
    const queueListArea = document.getElementById('queue-list-area');
    const startQueueButton = document.getElementById('start-queue-button');
    const clearCompletedButton = document.getElementById('clear-completed-button');
    const adminSearchQuery = document.getElementById('admin-search-query');
    const searchAdminButton = document.getElementById('search-admin-button');
    const adminSearchResultArea = document.getElementById('admin-search-result-area');
    const adminDownloadUrlInput = document.getElementById('admin-download-url');
    const fetchAdminDownloadButton = document.getElementById('fetch-admin-download-button');
    const adminDownloadResultArea = document.getElementById('admin-download-result-area');

    const copyHostinfoButton = document.getElementById('copy-hostinfo-button');
    
    backButtons.forEach(button => button.addEventListener('click', showHub));
    themeToggleButton.addEventListener('click', () => setTema(!document.documentElement.classList.contains('dark')));
    themeToggleSwitch.addEventListener('change', (e) => setTema(e.target.checked));
    resultsPerPageInput.addEventListener('change', (e) => {
        let newValue = parseInt(e.target.value);
        if (isNaN(newValue) || newValue < 3) newValue = 3;
        if (newValue > 50) newValue = 50;
        e.target.value = newValue;
        RESULTS_PER_PAGE = newValue;
        localStorage.setItem('resultsPerPage', newValue);
        showToast(`Hasil per halaman diubah menjadi ${newValue}`, 'info');
    });
    clearApiCacheButton.addEventListener('click', clearApiCache);
    clearHistorySettingsButton.addEventListener('click', () => { if (confirm('Yakin ingin hapus riwayat?')) { 
    localStorage.removeItem('downloadHistory'); 
    showToast('Riwayat unduhan telah dibersihkan.', 'info');
} });
    showSettingsButton.addEventListener('click', (e) => { e.preventDefault(); showPage(settingsPage, loadSettings); });
    showQueueButton.addEventListener('click', (e) => { e.preventDefault(); showPage(queuePage, renderQueue); });
    showHistoryButton.addEventListener('click', (e) => { e.preventDefault(); showPage(historyPage, loadHistory); });
    clearHistoryButton.addEventListener('click', () => { if (confirm('Yakin ingin hapus riwayat?')) { localStorage.removeItem('downloadHistory'); loadHistory(); } });
    copyHostinfoButton.addEventListener('click', async () => {
    const resultText = hostinfoResultArea.innerText;

    if (!resultText || hostinfoResultArea.querySelector('.error-box')) {
        showErrorModal('Tidak Ada Info', 'Tidak ada teks yang bisa disalin.');
        return;
    }

    try {
        await navigator.clipboard.writeText(resultText);
        showToast('Info Host berhasil disalin!', 'success');
    } catch (err) {
        displayError(null, new Error('Gagal menyalin ke clipboard. Browser Anda mungkin tidak mendukung fitur ini.'));
    }
});


searchAdminButton.addEventListener('click', searchAdminContent);
document.getElementById('admin-load-more-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('load-more-button')) {
        adminCurrentPage++;
        displayAdminResults();
    }
});
    
// Letakkan ini di bagian atas script.js
const featureConfig = {
    'tts': {
        pageId: 'tts-page',
        inputId: 'tts-text-input',
        buttonId: 'fetch-tts-button'
    },
    'tiktok-v2': {
        pageId: 'tiktok-v2-downloader-page',
        inputId: 'tiktok-v2-url-input',
        buttonId: 'fetch-tiktok-v2-button'
    },
    'instagram-v2': {
        pageId: 'instagram-v2-downloader-page',
        inputId: 'instagram-v2-url-input',
        buttonId: 'fetch-instagram-v2-button'
    },
    'pinterest-v2': {
        pageId: 'pinterest-v2-downloader-page',
        inputId: 'pinterest-v2-url-input',
        buttonId: 'fetch-pinterest-v2-button'
    },
    'snackvideo': {
        pageId: 'snackvideo-downloader-page',
        inputId: 'snackvideo-url-input',
        buttonId: 'fetch-snackvideo-button'
    },
    'facebook': {
        pageId: 'facebook-downloader-page',
        inputId: 'facebook-url-input',
        buttonId: 'fetch-facebook-button'
    },
    'spotify-dl': {
        pageId: 'spotify-downloader-page',
        inputId: 'spotify-url-input',
        buttonId: 'fetch-spotify-button'
    },
    'youtube-v2': {
        pageId: 'youtube-v2-downloader-page',
        inputId: 'youtube-v2-url-input',
        buttonId: 'fetch-youtube-v2-options-button'
    },
    // --- (Vintex) ---
    'tiktok-vintex': {
        pageId: 'tiktok-downloader-page',
        inputId: 'tiktok-url-input',
        buttonId: 'fetch-tiktok-video-button'
    },
    'youtube-vintex': {
        pageId: 'youtube-downloader-page',
        inputId: 'youtube-url-input',
        buttonId: 'fetch-youtube-mp4-button' // Kita targetkan salah satu tombol saja
    },
    'instagram-vintex': {
        pageId: 'instagram-downloader-page',
        inputId: 'instagram-url-input',
        buttonId: 'fetch-instagram-media-button'
    },
    'pinterest-vintex': {
        pageId: 'pinterest-downloader-page',
        inputId: 'pinterest-url-input',
        buttonId: 'fetch-pinterest-media-button'
    }
    // Tambahkan fitur lain di sini jika perlu
};

    
    const ttsTextInput = document.getElementById('tts-text-input'), fetchTtsButton = document.getElementById('fetch-tts-button'), ttsResultArea = document.getElementById('tts-result-area');
    const tiktokV2UrlInput = document.getElementById('tiktok-v2-url-input'), fetchTiktokV2Button = document.getElementById('fetch-tiktok-v2-button'), tiktokV2ResultArea = document.getElementById('tiktok-v2-result-area');
    const instagramV2UrlInput = document.getElementById('instagram-v2-url-input'), fetchInstagramV2Button = document.getElementById('fetch-instagram-v2-button'), instagramV2ResultArea = document.getElementById('instagram-v2-result-area');
    const pinterestV2UrlInput = document.getElementById('pinterest-v2-url-input'), fetchPinterestV2Button = document.getElementById('fetch-pinterest-v2-button'), pinterestV2ResultArea = document.getElementById('pinterest-v2-result-area');
    const snackvideoUrlInput = document.getElementById('snackvideo-url-input'), fetchSnackvideoButton = document.getElementById('fetch-snackvideo-button'), snackvideoResultArea = document.getElementById('snackvideo-result-area');
    const facebookUrlInput = document.getElementById('facebook-url-input'), fetchFacebookButton = document.getElementById('fetch-facebook-button'), facebookResultArea = document.getElementById('facebook-result-area');
    const spotifyUrlInput = document.getElementById('spotify-url-input'), fetchSpotifyButton = document.getElementById('fetch-spotify-button'), spotifyResultArea = document.getElementById('spotify-result-area');
    const spotifySearchQuery = document.getElementById('spotify-search-query'), searchSpotifyButton = document.getElementById('search-spotify-button'), spotifySearchResultArea = document.getElementById('spotify-search-result-area');
    const gimageSearchQuery = document.getElementById('gimage-search-query'), searchGimageButton = document.getElementById('search-gimage-button'), gimageSearchResultArea = document.getElementById('gimage-search-result-area');
    const playstoreSearchQuery = document.getElementById('playstore-search-query'), searchPlaystoreButton = document.getElementById('search-playstore-button'), playstoreSearchResultArea = document.getElementById('playstore-search-result-area');
    const fdroidSearchQuery = document.getElementById('fdroid-search-query'), searchFdroidButton = document.getElementById('search-fdroid-button'), fdroidSearchResultArea = document.getElementById('fdroid-search-result-area');
    const youtubeV2UrlInput = document.getElementById('youtube-v2-url-input'), youtubeV2CustomFilenameInput = document.getElementById('youtube-v2-custom-filename'), fetchYoutubeV2OptionsButton = document.getElementById('fetch-youtube-v2-options-button'), youtubeV2OptionsArea = document.getElementById('youtube-v2-options-area'), youtubeV2ResultArea = document.getElementById('youtube-v2-result-area');
    const tiktokUrlInput = document.getElementById('tiktok-url-input'), tiktokCustomFilenameInput = document.getElementById('tiktok-custom-filename'), fetchTiktokVideoButton = document.getElementById('fetch-tiktok-video-button'), tiktokResultArea = document.getElementById('tiktok-result-area');
    const youtubeUrlInput = document.getElementById('youtube-url-input'), youtubeCustomFilenameInput = document.getElementById('youtube-custom-filename'), fetchYoutubeMp4Button = document.getElementById('fetch-youtube-mp4-button'), fetchYoutubeMp3Button = document.getElementById('fetch-youtube-mp3-button'), youtubeResultArea = document.getElementById('youtube-result-area');
    const instagramUrlInput = document.getElementById('instagram-url-input'), instagramCustomFilenameInput = document.getElementById('instagram-custom-filename'), fetchInstagramMediaButton = document.getElementById('fetch-instagram-media-button'), instagramResultArea = document.getElementById('instagram-result-area');
    const pinterestUrlInput = document.getElementById('pinterest-url-input'), pinterestCustomFilenameInput = document.getElementById('pinterest-custom-filename'), fetchPinterestMediaButton = document.getElementById('fetch-pinterest-media-button'), pinterestResultArea = document.getElementById('pinterest-result-area');
    const sswebUrlInput = document.getElementById('ssweb-url-input'), fetchSswebButton = document.getElementById('fetch-ssweb-button'), sswebResultArea = document.getElementById('ssweb-result-area');
    const hostinfoUrlInput = document.getElementById('hostinfo-url-input'), fetchHostinfoButton = document.getElementById('fetch-hostinfo-button'), hostinfoResultArea = document.getElementById('hostinfo-result-area');
    const toghibliUrlInput = document.getElementById('toghibli-url-input'), toghibliPromptInput = document.getElementById('toghibli-prompt-input'), fetchToghibliButton = document.getElementById('fetch-toghibli-button'), toghibliResultArea = document.getElementById('toghibli-result-area');
    const reminiUrlInput = document.getElementById('remini-url-input'), fetchReminiButton = document.getElementById('fetch-remini-button'), reminiResultArea = document.getElementById('remini-result-area');
    const upscaleUrlInput = document.getElementById('upscale-url-input'), fetchUpscaleButton = document.getElementById('fetch-upscale-button'), upscaleResultArea = document.getElementById('upscale-result-area');
    const randomWaifuResultArea = document.getElementById('random-waifu-result-area'), fetchRandomWaifuButton = document.getElementById('fetch-random-waifu-button');
    const randomNsfwResultArea = document.getElementById('random-nsfw-result-area'), fetchRandomNsfwButton = document.getElementById('fetch-random-nsfw-button');
    const randomPapayangResultArea = document.getElementById('random-papayang-result-area'), fetchRandomPapayangButton = document.getElementById('fetch-random-papayang-button');

    let RESULTS_PER_PAGE = parseInt(localStorage.getItem('resultsPerPage')) || 9;
    let apiStatusData = {};
    let spotifyResults = [];
    let spotifyCurrentPage = 0;
    let gimageResults = [];
    let adminResults = [];
    let adminCurrentPage = 0;
    let gimageCurrentPage = 0;
    let pinterestResults = [];
    let pinterestCurrentPage = 0;
    let downloadQueue = JSON.parse(localStorage.getItem('downloadQueue')) || [];
    let isFFmpegLoaded = false;
    let isQueueProcessing = false;

    function setTema(isDark) {
        if(themeToggleSwitch) themeToggleSwitch.checked = isDark;
        if (isDark) {
            document.documentElement.classList.add('dark');
            if(themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            if(themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
            localStorage.setItem('theme', 'light');
        }
    }

    function loadSettings() {
        if(themeToggleSwitch) themeToggleSwitch.checked = document.documentElement.classList.contains('dark');
        if(resultsPerPageInput) resultsPerPageInput.value = RESULTS_PER_PAGE;
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('downloadHistory')) || [];
        if (!historyListArea) return;
        if (history.length === 0) {
            historyListArea.innerHTML = `<p class="text-center">Belum ada riwayat unduhan.</p>`;
            return;
        }
        historyListArea.innerHTML = history.map(item => {
            let mediaPreviewHTML = '';
            if (item.type === 'video') {
                mediaPreviewHTML = `<video controls muted class="w-full rounded-md mt-2 max-h-60" src="${item.url}"></video>`;
            } else if (item.type === 'image') {
                mediaPreviewHTML = `<img class="w-full rounded-md mt-2 max-h-60 object-cover" src="${item.url}" alt="${item.filename}">`;
            } else if (item.type === 'audio') {
                 mediaPreviewHTML = `<audio controls class="w-full mt-2" src="${item.url}"></audio>`;
            }
            return `
                <div class="history-item">
                    <p class="filename">${item.filename}</p>
                    <p class="timestamp">${new Date(item.date).toLocaleString('id-ID')}</p>
                    ${mediaPreviewHTML ? `<div class="mt-2">${mediaPreviewHTML}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    function saveToHistory(filename, url, type) {
        let history = JSON.parse(localStorage.getItem('downloadHistory')) || [];
        history.unshift({ filename: filename, url: url, type: type, date: new Date().toISOString() });
        if (history.length > 50) history.pop();
        localStorage.setItem('downloadHistory', JSON.stringify(history));
    }
    
    function saveQueue() {
        localStorage.setItem('downloadQueue', JSON.stringify(downloadQueue));
    }

    function renderQueue() {
        if (!queueListArea) return;
        if (downloadQueue.length === 0) {
            queueListArea.innerHTML = `<p class="text-center">Antrean kosong.</p>`;
            return;
        }
        queueListArea.innerHTML = downloadQueue.map((item, index) => `
            <div class="queue-item">
                <i class="fas fa-file-alt fa-2x w-12 text-center"></i>
                <div class="queue-item-info">
                    <p class="queue-item-filename">${item.filename}</p>
                    <div class="queue-item-status">
                        <span class="status-badge ${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function addToQueue(item) {
        downloadQueue.push({ ...item, status: 'pending', id: Date.now() });
        saveQueue();
        showToast(`"${item.filename}" ditambahkan ke antrean`, 'success');
        processQueue();
    }
    
    function clearApiCache() {
        alert('Cache API akan dibersihkan di sini nanti.');
    }
    
    const apiEndpoints = {
        'tts': { url: `${API_BASE_URL}/tools/text-to-speech?text=test` },
        'tiktok-v2': { url: `${API_BASE_URL}/download/tiktok?url=https://www.tiktok.com/@mr.kunn/video/7370899450377030913` },
        'instagram-v2': { url: `${API_BASE_URL}/download/instagram?url=https://www.instagram.com/p/C8U0Y80y9xc/` },
        'pinterest-v2': { url: `${API_BASE_URL}/download/pinterest?url=https://id.pinterest.com/pin/11075286399619556/` },
        'snackvideo': { url: `${API_BASE_URL}/download/snackvideo?url=https://snackvideo.com/@MR.KUN/video/5229243730248039750` },
        'facebook': { url: `${API_BASE_URL}/download/facebook?url=https://www.facebook.com/reel/1183861299622933` },
        'spotify-dl': { url: `${API_BASE_URL}/download/spotify?url=https://open.spotify.com/track/4py7b9I212y2A1AwSCS16M` },
        'spotify-search': { url: `${API_BASE_URL}/search/spotify?query=test` },
        'gimage': { url: `${API_BASE_URL}/search/gimage?q=test` },
        'playstore': { url: `${API_BASE_URL}/search/playstore?q=test` },
        'fdroid': { url: `${API_BASE_URL}/search/fdroid?q=test` },
        'ig-profile': { url: `https://api.vyturex.com/profile?username=instagram` },
        'web-to-pdf': { url: `https://api.vyturex.com/html2pdf?url=https://google.com` },
        'youtube-v2': { url: `${API_BASE_URL}/download/savetube?link=https://www.youtube.com/watch?v=dQw4w9WgXcQ` },
        'ssweb': { url: `${API_BASE_URL}/tools/ssweb?url=https://google.com` },
        'hostinfo': { url: `${API_BASE_URL}/tools/hostinfo?host=google.com` },
        'toghibli': { url: `${API_BASE_URL}/tools/toghibli?url=https://i.ibb.co/6y4nwtB/photo-1511367461989-f85a21fda167.jpg` },
        'remini': { url: `${API_BASE_URL}/imagecreator/remini?url=https://i.ibb.co/6y4nwtB/photo-1511367461989-f85a21fda167.jpg` },
        'upscale': { url: `${API_BASE_URL}/imagecreator/upscale?url=https://i.ibb.co/6y4nwtB/photo-1511367461989-f85a21fda167.jpg` },
        'random-waifu': { url: `${API_BASE_URL}/random/waifu` },
        'random-nsfw': { url: `${API_BASE_URL}/random/nsfw` },
        'random-papayang': { url: `${API_BASE_URL}/random/papayang` },
        'tiktok-vintex': { url: `https://api.ownblox.my.id/api/ttdl?url=https://www.tiktok.com/@mr.kunn/video/7370899450377030913` },
        'youtube-vintex': { url: `https://api.ownblox.my.id/api/ytdl?url=https://api.ownblox.my.id/api/ytdl?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ&type=mp3` },
        'instagram-vintex': { url: `https://api.ownblox.my.id/api/igdl?url=https://www.instagram.com/p/C8U0Y80y9xc/` },
        'pinterest-vintex': { url: `https://api.ownblox.my.id/api/pinterest?q=test` },
        'remove-bg': { url: 'https://api.remove.bg/v1/removebg' }
};


// ==========================================================
// ===== KODE BARU UNTUK KOMPRESOR GAMBAR =====================
// ==========================================================

let currentImageToCompress = null; // Menyimpan gambar yang sedang aktif

// Fungsi utama untuk memproses dan mengompres gambar
async function processAndCompressImage(imageSrc) {
    if (!imageSrc) return;
    currentImageToCompress = imageSrc; // Simpan gambar saat ini
    
    compressorOptions.classList.remove('hidden'); // Tampilkan opsi
    compressorResultArea.innerHTML = `<div class="text-center font-semibold">Memproses gambar...</div>`;

    const img = new Image();
    // PENTING: untuk mengatasi error CORS saat memuat gambar dari URL
    img.crossOrigin = "anonymous";

    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const format = compressorFormatSelect.value;
        const quality = parseInt(compressorQualitySlider.value) / 100;
        const extension = format.split('/')[1];

        // Sembunyikan slider kualitas jika formatnya PNG (karena PNG tidak punya setelan kualitas)
        qualitySliderContainer.style.display = format === 'image/png' ? 'none' : 'block';

        const compressedUrl = canvas.toDataURL(format, quality);
        const newFilename = `compressed_by_vintex.${extension}`;
        
        // Hitung ukuran untuk perbandingan
        const originalSize = imageSrc.size ? (imageSrc.size / 1024).toFixed(2) : 'N/A'; // imageSrc adalah File/Blob
        const compressedBlob = Aplication.Util.dataURLtoBlob(compressedUrl);
        const compressedSize = (compressedBlob.size / 1024).toFixed(2);
        const savings = originalSize !== 'N/A' ? (100 - (compressedSize / originalSize * 100)).toFixed(0) : 'N/A';

        // Tampilkan hasil
        compressorResultArea.innerHTML = `
            <h4 class="font-bold text-center mb-4">Hasil Kompresi</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div class="text-center">
                    <p class="font-semibold mb-2">Gambar Asli (${originalSize} KB)</p>
                    <img src="${URL.createObjectURL(imageSrc)}" class="w-full rounded-lg shadow-md border">
                </div>
                <div class="text-center">
                    <p class="font-semibold mb-2">Hasil Kompresi (${compressedSize} KB)</p>
                    <img src="${compressedUrl}" class="w-full rounded-lg shadow-md border">
                </div>
            </div>
            <div class="text-center mt-6">
                ${originalSize !== 'N/A' ? `<p class="mb-4 font-bold text-green-500">Ukuran Berkurang ${savings}% !</p>` : ''}
                <a href="${compressedUrl}" download="${newFilename}" class="new-dl-button inline-block bg-green-600 text-white font-bold py-2 px-6 rounded-lg">
                    <i class="fas fa-download mr-2"></i>Download Hasil
                </a>
            </div>
        `;
    };

    img.onerror = () => {
        displayError(compressorResultArea, new Error("Gagal memuat gambar dari URL. Pastikan link valid dan bisa diakses."));
    };
    
    // Jika input adalah file, buat URL objek. Jika URL, langsung gunakan.
    if (imageSrc instanceof File) {
        img.src = URL.createObjectURL(imageSrc);
    } else {
        // Gunakan proxy untuk URL eksternal
        img.src = `https://api.allorigins.win/raw?url=${encodeURIComponent(imageSrc)}`;
    }
}

// --- Event Listener untuk Fitur Kompresor ---
document.getElementById('show-image-compressor-page').addEventListener('click', (e) => {
    e.preventDefault();
    showPage(document.getElementById('image-compressor-page'), () => {
        // Logika untuk tab input
        const page = document.getElementById('image-compressor-page');
        const tabButtons = page.querySelectorAll('.studio-tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                page.querySelectorAll('.studio-tab-content').forEach(c => c.classList.add('hidden'));
                document.getElementById(`tab-content-${button.dataset.tab}`).classList.remove('hidden');
            });
        });
    });
});

compressorFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        processAndCompressImage(e.target.files[0]);
    }
});

compressorUrlButton.addEventListener('click', () => {
    if (compressorUrlInput.value) {
        // Untuk URL, kita perlu handle sebagai string
        processAndCompressImage(compressorUrlInput.value);
    } else {
        showErrorModal('Input Kosong', 'Silakan masukkan URL gambar.');
    }
});

// Update kompresi secara real-time saat slider atau format diubah
compressorQualitySlider.addEventListener('input', (e) => {
    qualitySliderValue.textContent = e.target.value;
    if (currentImageToCompress) processAndCompressImage(currentImageToCompress);
});
compressorFormatSelect.addEventListener('change', () => {
    if (currentImageToCompress) processAndCompressImage(currentImageToCompress);
});

// Helper untuk mengubah data URL ke Blob (untuk menghitung ukuran)
// Pastikan objek Aplikasi sudah ada atau buat jika belum
window.Aplication = window.Aplication || {};
Aplication.Util = {
    dataURLtoBlob: function(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }
}


    // --- FUNGSI BARU UNTUK CEK STATUS API (LEBIH AKURAT) ---
async function checkApiStatus(isInitialLoad = false) {
    const settingsButton = document.getElementById('show-settings-button');
    const refreshButtonIcon = settingsButton ? settingsButton.querySelector('i') : null;

    // Hanya tampilkan ikon berputar jika pengecekan ini dipicu oleh pengguna (bukan saat awal muat)
    if (!isInitialLoad && refreshButtonIcon) {
        refreshButtonIcon.classList.add('spin');
    }

    // Loop melalui setiap endpoint di objek apiEndpoints
    for (const id in apiEndpoints) {
        const statusDot = document.querySelector(`.api-status[data-api-id="${id}"]`);
        if (!statusDot) continue;

        // Reset status sebelum pengecekan baru
        statusDot.classList.remove('online', 'offline');

        try {
            // Kita gunakan proxy untuk mendapatkan status yang sebenarnya dan menghindari CORS
            const proxiedApiUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(apiEndpoints[id].url)}`;
            
            // Tambahkan timeout 15 detik untuk fetch
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const response = await fetch(proxiedApiUrl, { signal: controller.signal });
            
            clearTimeout(timeoutId); // Hapus timeout jika fetch berhasil

            // 'response.ok' hanya bernilai true jika status HTTP adalah 200-299
            if (response.ok) {
                statusDot.classList.add('online');
            } else {
                statusDot.classList.add('offline');
            }
        } catch (error) {
            console.warn(`Pengecekan status API gagal untuk ${id}:`, error.name);
            statusDot.classList.add('offline');
        }
    }
    
    // Hentikan ikon berputar setelah selesai
    if (refreshButtonIcon) {
        setTimeout(() => refreshButtonIcon.classList.remove('spin'), 1000);
    }
}
    
    function validateInput(inputElement, type = 'text') {
        const value = inputElement.value.trim();
        if (!value) {
            throw new Error("Input tidak boleh kosong.");
        }
        const patterns = {
            url: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/,
            tiktok: /tiktok\.com/,
            youtube: /youtube\.com|youtu\.be/,
            instagram: /instagram\.com/,
            pinterest: /pinterest\.com|pin\.it/,
            facebook: /facebook\.com|fb\.watch/,
            spotify: /spotify\.com/,
        };
        if (type !== 'text' && !patterns[type].test(value)) {
            throw new Error(`URL ${type.charAt(0).toUpperCase() + type.slice(1)} sepertinya tidak valid.`);
        }
        return value;
    }

    function displayLoading(area, button, type = 'card') {
        if(button) {
            button.disabled = true;
            button.innerHTML = `<div class="flex justify-center items-center"><div class="animate-spin rounded-full h-5 w-5 border-b-2"></div></div>`;
        }
        let skeletonHTML = '';
        switch (type) {
            case 'list':
                skeletonHTML = Array(5).fill('').map(() => `
                    <div class="flex items-center space-x-4 p-2">
                        <div class="skeleton avatar"></div>
                        <div class="flex-1 space-y-2">
                            <div class="skeleton text w-3/4"></div>
                            <div class="skeleton text w-1/2"></div>
                        </div>
                    </div>
                `).join('');
                break;
            case 'grid':
                skeletonHTML = `<div class="grid grid-cols-2 md:grid-cols-3 gap-4">` +
                Array(6).fill('').map(() => `<div class="skeleton thumbnail"></div>`).join('') + `</div>`;
                break;
            case 'card':
            default:
                skeletonHTML = `
                    <div class="p-2">
                        <div class="skeleton thumbnail mb-4"></div>
                        <div class="skeleton title"></div>
                        <div class="skeleton text w-full"></div>
                        <div class="skeleton text w-3/4"></div>
                    </div>
                `;
                break;
        }
        area.innerHTML = skeletonHTML;
    }

    // GANTI FUNGSI LAMA DENGAN VERSI BARU INI
function displayError(area, error) {
    console.error(error); // Tetap tampilkan di console untuk debugging kita

    // Logika untuk menentukan judul dan pesan
    let title = "Terjadi Kesalahan";
    let message = error.message || "Server mungkin sedang sibuk atau URL yang Anda masukkan tidak valid. Silakan coba lagi beberapa saat.";

    if (error.message.includes("Failed to fetch") || error.message.includes("Gagal memuat pustaka")) {
        title = "Koneksi Gagal";
        message = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba matikan Ad-Blocker.";
    } else if (error.message.toLowerCase().includes("not found") || error.message.toLowerCase().includes("tidak ditemukan")) {
        title = "Tidak Ditemukan";
        message = "Konten yang Anda cari tidak ditemukan. Pastikan URL atau kata kunci sudah benar.";
    } else if (error.message.toLowerCase().includes("valid")) {
        title = "Input Tidak Valid";
    }

    // Panggil modal error baru kita!
    showErrorModal(title, message);

    // Kosongkan area loading di belakang modal
    if (area) {
        area.innerHTML = '';
    }
}

    async function showNotification(title, options = {}) {
        if (!('Notification' in window)) {
            console.log('Browser ini tidak mendukung notifikasi.');
            return;
        }
        let permission = Notification.permission;
        if (permission === 'default') {
            permission = await Notification.requestPermission();
        }
        if (permission === 'granted') {
            const defaultOptions = {
                body: '',
                icon: 'icon.png',
                badge: 'icon.png',
                vibrate: [200, 100, 200],
            };
            const notification = new Notification(title, { ...defaultOptions, ...options });
            if (options.onClick) {
                notification.onclick = options.onClick;
            }
            return notification;
        }
    }
    
    async function updateQueueNotification() {
        if (!('Notification' in window) || Notification.permission !== 'granted') return;
        const completedCount = downloadQueue.filter(item => item.status === 'completed').length;
        const failedCount = downloadQueue.filter(item => item.status === 'failed').length;
        const totalCount = downloadQueue.length;
        if (totalCount === 0) return;
        let title = `Antrean Unduhan (${completedCount}/${totalCount} Selesai)`;
        if (failedCount > 0) {
            title += ` - ${failedCount} Gagal`;
        }
        const bodyItems = downloadQueue.slice(0, 4).map(item => {
            let icon = '⏳';
            if (item.status === 'completed') icon = '✅';
            if (item.status === 'failed') icon = '❌';
            if (item.status === 'pending') icon = '...';
            return `${icon} ${item.filename}`;
        }).join('\n');
        const isDone = (completedCount + failedCount) === totalCount;
        showNotification(title, {
            body: bodyItems,
            tag: 'download-queue-summary',
            renotify: false,
            silent: true,
            requireInteraction: !isDone,
        });
    }

    function createShareButtonHTML(options) {
    if (navigator.share) {
        // PERUBAHAN DI SINI: Kita tidak lagi menggunakan options.url secara langsung.
        // Kita akan membuat link ke website kita sendiri dengan parameter.
        // Contoh: https://websiteku.com/?feature=tiktok&url=https://tiktok.com/video/123
        const shareableUrl = `${window.location.origin}${window.location.pathname}?feature=${options.featureId}&mediaUrl=${encodeURIComponent(options.url)}`;

        const title = options.title || document.title;
        const text = options.text || `Lihat konten ini di All-in-One Downloader!`;
        
        // Sekarang kita gunakan URL baru yang sudah kita buat
        return `<button class="share-button" data-url="${shareableUrl}" data-title="${title}" data-text="${text}"><i class="fas fa-share-alt"></i></button>`;
    }
    return '';
}
    
    function handleSharedUrl() {
    const params = new URLSearchParams(window.location.search);
    const feature = params.get('feature');
    const mediaUrl = params.get('mediaUrl');

    if (feature && mediaUrl) {
        console.log(`Mendeteksi link yang dibagikan: Fitur=${feature}, URL=${mediaUrl}`);
        
        // Ambil konfigurasi untuk fitur yang sesuai dari "peta" kita
        const config = featureConfig[feature];

        if (config) {
            const pageElement = document.getElementById(config.pageId);
            if (!pageElement) {
                console.error(`Elemen halaman dengan ID '${config.pageId}' tidak ditemukan.`);
                return;
            }
            
            // Tampilkan halaman yang benar
            showPage(pageElement);

            // Isi otomatis input dan klik tombol fetch setelah halaman tampil
            setTimeout(() => {
                const urlInput = document.getElementById(config.inputId);
                const fetchButton = document.getElementById(config.buttonId);

                if (urlInput && fetchButton) {
                    urlInput.value = mediaUrl;
                    fetchButton.click();
                } else {
                    console.error(`Input atau Tombol tidak ditemukan di halaman '${config.pageId}'`);
                }
            }, 200); // Jeda sedikit lebih lama untuk memastikan semuanya siap
        } else {
            console.error(`Konfigurasi untuk fitur '${feature}' tidak ditemukan di featureConfig.`);
        }
    }
}
    
    
    function showPage(pageToShow, callback = null) {
        const activePage = document.querySelector('.page:not(.hidden)');
        if (activePage) {
            activePage.style.opacity = '0';
            setTimeout(() => {
                activePage.classList.add('hidden');
                if (pageToShow) {
                    pageToShow.classList.remove('hidden');
                    setTimeout(() => { pageToShow.style.opacity = '1'; }, 20);
                    if (callback) callback();
                }
            }, 300);
        } else if (pageToShow) {
            if(mainHubPage && pageToShow !== mainHubPage) mainHubPage.classList.add('hidden');
            pageToShow.classList.remove('hidden');
            setTimeout(() => { pageToShow.style.opacity = '1'; }, 20);
            if (callback) callback();
        }
    }

    function showHub() {
        const activePage = document.querySelector('.page:not(#main-hub-page):not(.hidden)');
        if (activePage) {
            activePage.style.opacity = '0';
            setTimeout(() => {
                activePage.classList.add('hidden');
                if (mainHubPage) {
                    mainHubPage.classList.remove('hidden');
                    setTimeout(() => { mainHubPage.style.opacity = '1'; }, 20);
                }
            }, 300);
        }
    }

    async function executeDownload(url, filename) {
        try {
            const fileExtension = filename.split('.').pop().toLowerCase();
            let mediaType = 'file';
            if(['mp4', 'webm'].includes(fileExtension)) mediaType = 'video';
            else if(['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) mediaType = 'image';
            else if(['mp3', 'wav', 'ogg'].includes(fileExtension)) mediaType = 'audio';

            const proxiedUrl = 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(url);
            const response = await fetch(proxiedUrl);
            if (!response.ok) throw new Error(`Proxy error: Status ${response.status}`);
            
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const tempLink = document.createElement('a');
            tempLink.href = objectUrl;
            tempLink.download = filename;
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            
            saveToHistory(filename, url, mediaType);
        } catch (error) {
            console.error("Execute Download Error:", error);
            throw error;
        }
    }

    async function forceDownload(url, filename, buttonElement) {
        const originalText = buttonElement.innerHTML;
        buttonElement.disabled = true;
        buttonElement.innerHTML = `<span>Memulai...</span>`;
        try {
            await executeDownload(url, filename);
            
            document.getElementById('success-audio-player')?.play();
            
            showNotification('Unduhan Dimulai!', {
                body: `File "${filename}" sedang diunduh oleh browser Anda.`
            });
            if (!localStorage.getItem('promoNotifShown')) {
                setTimeout(() => {
                    showNotification('Suka dengan aplikasi ini?', {
                        body: 'Gabung grup WA kami untuk update & fitur terbaru!',
                        onClick: () => { window.open('https://chat.whatsapp.com/Fs51xgGlQQGFc169ppOTVd', '_blank'); }
                    });
                    localStorage.setItem('promoNotifShown', 'true');
                }, 10000);
            }
        } catch(error) {
            displayError(null, error);
        } finally {
            buttonElement.disabled = false;
            buttonElement.innerHTML = originalText;
        }
    }

    async function processQueue() {
        if (isQueueProcessing) return;
        const pendingItem = downloadQueue.find(item => item.status === 'pending');
        if (!pendingItem) {
            console.log('Antrean selesai diproses.');
            if (downloadQueue.length > 0) updateQueueNotification();
            return;
        }
        isQueueProcessing = true;
        pendingItem.status = 'downloading';
        saveQueue();
        if(typeof renderQueue === "function") renderQueue();
        if(typeof updateQueueNotification === "function") updateQueueNotification();
        try {
            await executeDownload(pendingItem.url, pendingItem.filename);
            pendingItem.status = 'completed';
        } catch (error) {
            pendingItem.status = 'failed';
        } finally {
            isQueueProcessing = false;
            saveQueue();
            if(typeof renderQueue === "function") renderQueue();
            if(typeof updateQueueNotification === "function") updateQueueNotification();
            setTimeout(processQueue, 1000);
        }
    }
    
function displaySpotifyResults() {
    const start = spotifyCurrentPage * RESULTS_PER_PAGE;
    const end = start + RESULTS_PER_PAGE;
    const paginatedItems = spotifyResults.slice(start, end);

    const resultsHTML = paginatedItems.map(track => {
        const filename = `${track.artist} - ${track.title}.mp3`.replace(/[<>:"/\\|?*]/g, '_');
        const fullTitle = `${track.artist} - ${track.title}`;
        const trackUrl = track.url || track.link; 

        return `<div class="bg-gradient-to-br p-3 flex items-center space-x-3">
                    <img src="${track.image}" alt="Cover" class="w-16 h-16 rounded">
                    <div class="flex-1 min-w-0">
                        <p class="font-semibold truncate">${track.title}</p>
                        <p class="text-sm truncate">${track.artist}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        ${createShareButtonHTML({ url: trackUrl, title: fullTitle, text: `Dengarkan lagu ${fullTitle}` })}
                        <button data-link="${track.link}" data-title="${fullTitle}" class="spotify-search-play-btn bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full"><i class="fas fa-play"></i></button>
                        <button data-url="${track.link}" data-filename="${filename}" class="add-to-queue-button"><i class="fas fa-plus"></i></button>
                        <button data-link="${track.link}" data-filename="${filename}" class="spotify-search-dl-btn bg-green-600 text-white w-10 h-10 flex items-center justify-center rounded-full"><i class="fas fa-download"></i></button>
                    </div>
                </div>`;
    }).join('');
    
    if (spotifyCurrentPage === 0) {
        spotifySearchResultArea.innerHTML = `<div class="space-y-3"></div>`;
        if(window.autoAnimate) autoAnimate(spotifySearchResultArea.querySelector('.space-y-3'));
    }
    spotifySearchResultArea.querySelector('.space-y-3').insertAdjacentHTML('beforeend', resultsHTML);

    const loadMoreContainer = document.getElementById('spotify-load-more-container');
    if (end < spotifyResults.length) {
        loadMoreContainer.innerHTML = `<button class="load-more-button">Muat Lebih Banyak (${end}/${spotifyResults.length})</button>`;
    } else {
        loadMoreContainer.innerHTML = '';
    }
}

// Fungsi baru untuk menampilkan modal error
function showErrorModal(title, message) {
    const overlay = document.getElementById('error-modal-overlay');
    const modal = document.getElementById('error-modal-widget');
    const modalTitle = document.getElementById('error-modal-title');
    const modalMessage = document.getElementById('error-modal-message');
    const closeButton = document.getElementById('close-error-modal-button');
    const audioPlayer = document.getElementById('error-audio-player');

    if (!overlay) return; // Keluar jika elemen tidak ada

    // Isi konten modal
    modalTitle.textContent = title;
    modalMessage.textContent = message;

    // Tampilkan modal dengan animasi
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 20);

    // Putar suara error
    if (audioPlayer) {
        audioPlayer.currentTime = 0; // Ulangi dari awal jika diklik cepat
        audioPlayer.play();
    }

    // Fungsi untuk menutup modal
    const closeModal = () => {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.95)';
        setTimeout(() => overlay.classList.add('hidden'), 300);
    };

    // Tambahkan event listener ke tombol tutup
    closeButton.onclick = closeModal;
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    };
}


function loadFFmpegScripts() {
    // Jika sudah dimuat, jangan lakukan apa-apa
    if (isFFmpegLoaded) return Promise.resolve();

    return new Promise((resolve, reject) => {
        const ffmpegScript = document.createElement('script');
        // URL BARU dari UNPKG
        ffmpegScript.src = 'https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js';
        
        ffmpegScript.onload = () => {
            const utilScript = document.createElement('script');
            // URL BARU dari UNPKG
            utilScript.src = 'https://unpkg.com/@ffmpeg/util@0.12.10/dist/umd/util.js';
            
            utilScript.onload = () => {
                isFFmpegLoaded = true;
                resolve();
            };
            utilScript.onerror = reject;
            document.head.appendChild(utilScript);
        };
        ffmpegScript.onerror = reject;
        document.head.appendChild(ffmpegScript);
    });
}

// GANTI FUNGSI LAMA DENGAN VERSI BARU (METODE SCRAPING)
async function fetchInstagramProfilePic() {
    displayLoading(igProfilePicResultArea, fetchIgProfilePicButton, 'card');
    try {
        // 1. Ambil username dari input
        const username = igUsernameInput.value.trim();
        if (!username) {
            throw new Error("Username tidak boleh kosong.");
        }

        // 2. Siapkan URL profil dan URL proxy untuk mengambil HTML-nya
        const profileUrl = `https://www.instagram.com/${username}/`;
        const proxiedUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(profileUrl)}`;

        // 3. Ambil data HTML dari halaman profil
        const response = await fetch(proxiedUrl);
        if (!response.ok) {
            throw new Error('User tidak ditemukan atau profilnya privat.');
        }
        const htmlText = await response.text();

        // 4. Cari link gambar menggunakan Regular Expression (regex)
        const match = htmlText.match(/<meta property="og:image" content="(.*?)"/);
        
        if (match && match[1]) {
            const hdPhotoUrl = match[1];
            const filename = `${username}_profile_pic.jpg`;

            // 5. Tampilkan hasilnya (versi simpel tanpa follower)
            igProfilePicResultArea.innerHTML = `
                <div class="max-w-sm mx-auto bg-[var(--bg-color-2)] rounded-xl shadow-lg space-y-2 p-4 border border-[var(--border-color)]">
                    <div class="text-center space-y-4">
                        <div class="mx-auto w-40 h-40">
                            <img class="object-cover w-40 h-40 rounded-full ring-4 ring-pink-500" src="${hdPhotoUrl}" alt="Foto Profil ${username}">
                        </div>
                        <div class="space-y-0.5">
                            <p class="text-lg text-[var(--text-color-light)] font-medium">@${username}</p>
                        </div>
                        <a href="${hdPhotoUrl}" download="${filename}" class="new-dl-button inline-block w-full mt-4 bg-pink-600 text-white font-bold py-3 px-6 rounded-lg">
                            <i class="fas fa-download mr-2"></i>Download Foto (HD)
                        </a>
                    </div>
                </div>
            `;
        } else {
            // Jika link gambar tidak ditemukan di HTML
            throw new Error('Tidak dapat menemukan foto profil. Pastikan username benar.');
        }

    } catch (error) {
        displayError(igProfilePicResultArea, error);
    } finally {
        fetchIgProfilePicButton.disabled = false;
        fetchIgProfilePicButton.innerHTML = '<i class="fas fa-search mr-2"></i>Lihat Foto Profil';
    }
}

function setupStudioTabs() {
    const tabButtons = document.querySelectorAll('.studio-tab-button');
    const tabContents = document.querySelectorAll('.studio-tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Hapus status aktif dari semua tombol
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Tambahkan status aktif ke tombol yang diklik
            button.classList.add('active');

            // Sembunyikan semua konten
            tabContents.forEach(content => content.classList.add('hidden'));

            // Tampilkan konten yang sesuai
            const tabId = button.dataset.tab;
            const contentToShow = document.getElementById(`tab-content-${tabId}`);
            if (contentToShow) {
                contentToShow.classList.remove('hidden');
            }
        });
    });
}


// GANTI FUNGSI handleAudioConversion LAMA ANDA DENGAN YANG INI
async function handleAudioConversion() {
    const file = audioConverterInput.files[0];
    if (!file) return;

    // Cek dulu apakah Pustaka FFmpeg sudah siap
    if (!window.FFmpeg || !window.FFmpeg.Util) {
        displayError(audioConverterResultArea, new Error("Pustaka FFmpeg belum siap. Coba segarkan halaman dan tunggu beberapa saat sebelum memilih file."));
        return;
    }

    const targetExtension = audioFormatSelect.value;
    audioConverterResultArea.innerHTML = `<div class="text-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"></div><p class="mt-2" id="ffmpeg-status">Memulai... Ini mungkin butuh waktu agak lama saat pertama kali.</p></div>`;
    const ffmpegStatus = document.getElementById('ffmpeg-status');

    try {
        // Ini adalah cara pemanggilan yang sudah diperbaiki dan lebih aman
        const { FFmpeg } = window.FFmpeg;
        const { fetchFile } = window.FFmpeg.Util;

        const ffmpeg = new FFmpeg();
        
        ffmpeg.on('log', ({ message }) => {
            console.log(message);
            if (message.includes('Duration:')) {
                ffmpegStatus.textContent = 'Menganalisis file audio...';
            }
        });
        
        ffmpegStatus.textContent = 'Memuat pustaka FFmpeg (~30 MB)...';
        await ffmpeg.load();

        ffmpegStatus.textContent = 'Membaca file Anda...';
        const inputData = await fetchFile(file);
        const originalFilename = file.name.substring(0, file.name.lastIndexOf('.'));
        const inputFilename = `input.${file.name.split('.').pop()}`;
        
        ffmpeg.writeFile(inputFilename, inputData);

        ffmpegStatus.textContent = `Mengonversi ke format ${targetExtension.toUpperCase()}...`;
        const outputFilename = `output.${targetExtension}`;
        await ffmpeg.exec(['-i', inputFilename, outputFilename]);

        ffmpegStatus.textContent = 'Menyiapkan hasil...';
        const data = await ffmpeg.readFile(outputFilename);

        const blob = new Blob([data.buffer], { type: `audio/${targetExtension}` });
        const convertedAudioUrl = URL.createObjectURL(blob);
        const newFilename = `${originalFilename}_converted.${targetExtension}`;

        audioConverterResultArea.innerHTML = `
            <div class="result-card bg-[var(--bg-color-2)] border border-[var(--border-color)] rounded-lg p-4">
                <h4 class="font-bold text-center mb-4">Konversi Berhasil!</h4>
                <audio controls class="w-full" src="${convertedAudioUrl}"></audio>
                <div class="text-center mt-6">
                    <a href="${convertedAudioUrl}" download="${newFilename}" class="new-dl-button inline-block bg-green-600 text-white font-bold py-2 px-6 rounded-lg">
                        <i class="fas fa-download mr-2"></i>Download (${targetExtension.toUpperCase()})
                    </a>
                </div>
            </div>
        `;

    } catch (error) {
        console.error(error);
        displayError(audioConverterResultArea, new Error("Gagal mengonversi audio. Pastikan format file didukung."));
    }
}
async function processRemoveBg(imageUrlFromUpload = null) {
    const urlInput = document.getElementById('remove-bg-url-input');
    const resultArea = document.getElementById('remove-bg-result-area');
    const processButton = document.getElementById('process-remove-bg-button');
    
    // Kita gunakan API Key publik untuk percobaan. 
    // Anda bisa mendaftar di lolhuman.xyz untuk mendapatkan kunci pribadi gratis.
    const LOLHUMAN_API_KEY = 'haikalgans'; 

    displayLoading(resultArea, processButton, 'card');
    try {
        const imageUrl = imageUrlFromUpload ? imageUrlFromUpload : validateInput(urlInput, 'url');
        if (!imageUrl) throw new Error("URL gambar tidak valid.");

        // API endpoint baru dari lolhuman
        const apiUrl = `https://api.lolhuman.xyz/api/removebg?apikey=${LOLHUMAN_API_KEY}&img=${encodeURIComponent(imageUrl)}`;
        
        // Kita tetap gunakan proxy untuk jaga-jaga dari blokir CORS
        const proxiedApiUrl = `https://api.codetabs.com/v1/proxy?quest=${apiUrl}`;

        const response = await fetch(proxiedApiUrl);

        if (!response.ok) {
            throw new Error(`API lolhuman gagal merespons. Status: ${response.status}`);
        }

        // API ini mengembalikan gambar secara langsung, jadi kita handle sebagai blob
        const imageBlob = await response.blob();
        if (imageBlob.size === 0) {
             throw new Error("API merespons dengan data kosong. Coba gambar lain atau URL lain.");
        }

        const resultImageUrl = URL.createObjectURL(imageBlob);
        const filename = `removed_bg_${Date.now()}.png`;

        // Tampilkan hasil perbandingan (kode ini sama seperti sebelumnya)
        resultArea.innerHTML = `
            <h4 class="font-bold text-center mb-4">Hasil Perbandingan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="text-center"><p class="font-semibold mb-2">Gambar Asli</p><img src="${imageUrl}" class="w-full rounded-lg shadow-md border"></div>
                <div class="text-center"><p class="font-semibold mb-2">Latar Belakang Dihapus</p><img src="${resultImageUrl}" class="w-full rounded-lg shadow-md border"></div>
            </div>
            <div class="text-center mt-6">
                <a href="${resultImageUrl}" download="${filename}" class="new-dl-button inline-block bg-purple-600 text-white font-bold py-2 px-6 rounded-lg">
                    <i class="fas fa-download mr-2"></i>Download Hasil
                </a>
            </div>`;

    } catch (error) {
        displayError(resultArea, error);
    } finally {
        processButton.disabled = false;
        processButton.textContent = 'Proses Gambar via URL';
    }
}

// GANTI FUNGSI LAMA DENGAN VERSI BARU YANG ADA 'BENDERA'-NYA
// GANTI LAGI FUNGSI INI DENGAN VERSI FINAL YANG BISA MENAMPILKAN GAMBAR
function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code matched = ${decodedText}`, decodedResult);
    
    let resultHTML = '';
    const lowerCaseText = decodedText.toLowerCase();

    // Cek apakah hasilnya adalah link gambar
    if (lowerCaseText.startsWith('http') && (lowerCaseText.endsWith('.jpg') || lowerCaseText.endsWith('.jpeg') || lowerCaseText.endsWith('.png') || lowerCaseText.endsWith('.gif') || lowerCaseText.endsWith('.webp'))) {
        // --- PERUBAHAN DI SINI ---
        // Kita gunakan proxy untuk menampilkan gambar agar tidak diblokir
        const imageUrlViaProxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(decodedText)}`;
        
        resultHTML = `
            <h4 class="font-bold mb-2">Pemindaian Berhasil! (Gambar Ditemukan)</h4>
            <a href="${decodedText}" target="_blank" rel="noopener noreferrer" class="text-green-400 break-words hover:underline">${decodedText}</a>
            <img src="${imageUrlViaProxy}" alt="Hasil Pindaian QR" class="w-full max-w-xs mx-auto rounded-lg shadow-md border mt-4">
        `;
    } else if (lowerCaseText.startsWith('http')) {
        // Jika hanya link biasa (bukan gambar)
        resultHTML = `
            <h4 class="font-bold mb-2">Pemindaian Berhasil! (Link Ditemukan)</h4>
            <a href="${decodedText}" target="_blank" rel="noopener noreferrer" class="text-green-400 break-words hover:underline">${decodedText}</a>
        `;
    } else {
        // Jika hanya teks biasa
        resultHTML = `
            <h4 class="font-bold mb-2">Pemindaian Berhasil!</h4>
            <p class="text-green-400 break-words">${decodedText}</p>
        `;
    }

    qrScannerResultArea.innerHTML = `
        <div class="bg-[var(--bg-color-2)] p-4 rounded-lg border border-[var(--border-color)]">
            ${resultHTML}
            <button class="copy-qr-result-btn mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg" data-copy-text="${decodedText}">
                <i class="fas fa-copy mr-2"></i>Salin Hasil
            </button>
        </div>
    `;
    
    // Hentikan scanner jika masih aktif
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
            startScanButton.classList.remove('hidden');
            stopScanButton.classList.add('hidden');
            qrCameraReader.classList.remove('scanning');
        });
    }
}
function onScanFailure(error) {
    // console.warn(`Code scan error = ${error}`);
}

// --- Event Listeners untuk Fitur Pemindai QR ---
document.getElementById('show-qr-scanner-page').addEventListener('click', (e) => {
    e.preventDefault();
    showPage(qrScannerPage, () => {
        // Logika untuk tab
        const tabButtons = qrScannerPage.querySelectorAll('.studio-tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                qrScannerPage.querySelectorAll('.studio-tab-content').forEach(c => c.classList.add('hidden'));
                document.getElementById(`tab-content-${button.dataset.tab}`).classList.remove('hidden');
                
                // Hentikan scanner jika pindah tab
                if (html5QrCode && html5QrCode.isScanning) {
                     html5QrCode.stop();
                     startScanButton.classList.remove('hidden');
                     stopScanButton.classList.add('hidden');
                     qrCameraReader.classList.remove('scanning');
                }
            });
        });
        
        // Inisialisasi scanner jika belum ada
        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode("qr-camera-reader");
        }
    });
});

startScanButton.addEventListener('click', () => {
    qrScannerResultArea.innerHTML = `<p class="text-center text-[var(--text-color-light)]">Arahkan kamera ke Kode QR...</p>`;
    startScanButton.classList.add('hidden');
    stopScanButton.classList.remove('hidden');
    qrCameraReader.classList.add('scanning'); // Aktifkan animasi laser

    html5QrCode.start(
        { facingMode: "environment" }, // Gunakan kamera belakang
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        onScanFailure
    ).catch(err => {
        displayError(qrScannerResultArea, new Error("Gagal memulai kamera. Pastikan Anda memberikan izin akses kamera."));
        startScanButton.classList.remove('hidden');
        stopScanButton.classList.add('hidden');
        qrCameraReader.classList.remove('scanning');
    });
});

stopScanButton.addEventListener('click', () => {
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
            qrScannerResultArea.innerHTML = `<p class="text-center text-[var(--text-color-light)]">Pemindaian dihentikan.</p>`;
        }).catch(err => console.error("Gagal menghentikan scanner.", err));
    }
    startScanButton.classList.remove('hidden');
    stopScanButton.classList.add('hidden');
    qrCameraReader.classList.remove('scanning');
});

qrFileInput.addEventListener('change', (e) => {
    if (e.target.files.length === 0) return;
    const file = e.target.files[0];
    displayLoading(qrScannerResultArea);

    html5QrCode.scanFile(file, true)
        .then(onScanSuccess)
        .catch(err => {
            displayError(qrScannerResultArea, new Error("Tidak dapat menemukan Kode QR di dalam gambar."));
        });
});

// Ganti fungsi generateQRCode lama Anda dengan yang ini
async function generateQRCode(textToEncode) {
    const text = textToEncode || qrCodeTextInput.value.trim();

    if (text.length === 0) {
        qrCodeDisplayArea.classList.add('hidden');
        downloadQrCodeButton.classList.add('hidden');
        qrCodePlaceholder.classList.remove('hidden');
        qrCodePlaceholder.textContent = 'Kode QR akan muncul di sini setelah Anda mengetik.';
        return;
    }

    try {
        // Langkah 1: Gambar QR Code dasar ke canvas
        await QRCode.toCanvas(qrCodeCanvas, text, {
            width: 256,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff',
            },
            errorCorrectionLevel: 'H' // Level 'H' (High) sangat penting agar QR tetap bisa di-scan
        });
        
        // --- BAGIAN BARU UNTUK MENAMBAHKAN TEKS "BY VINTEX" ---
        const ctx = qrCodeCanvas.getContext('2d');
        const canvasSize = qrCodeCanvas.width;
        
        // Pengaturan Teks
        const brandText = 'BY VINTEX';
        ctx.font = 'bold 22px "Roboto", sans-serif'; // Atur jenis, ketebalan, dan ukuran font
        ctx.textAlign = 'center'; // Teks akan ditengah secara horizontal
        
        // Ukur lebar teks untuk membuat background putih
        const textMetrics = ctx.measureText(brandText);
        const textWidth = textMetrics.width;
        
        // Tentukan posisi tengah
        const x = canvasSize / 2;
        const y = canvasSize / 2;

        // Gambar kotak putih sebagai background teks (untuk readibilitas)
        // Diberi sedikit padding (ruang ekstra)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x - (textWidth / 2) - 10, y - 15, textWidth + 20, 30);
        
        // Gambar Teks Branding di atas kotak putih
        ctx.fillStyle = '#000000'; // Warna teks (hitam)
        ctx.textBaseline = 'middle'; // Ratakan teks secara vertikal
        ctx.fillText(brandText, x, y);
        // --- AKHIR BAGIAN BARU ---

        qrCodeDisplayArea.classList.remove('hidden');
        downloadQrCodeButton.classList.remove('hidden');
        qrCodePlaceholder.classList.add('hidden');

        downloadQrCodeButton.href = qrCodeCanvas.toDataURL('image/png');
        downloadQrCodeButton.download = 'qrcode_by_vintex.png';

    } catch (err) {
        console.error('Gagal membuat QR Code:', err);
        displayError(qrCodeDisplayArea, new Error('Gagal membuat QR Code. Coba teks yang lebih pendek.'));
    }
}

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    showToast('Mengunggah gambar...', 'info');

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            showToast('Upload berhasil! Memproses gambar...', 'success');
            const imageUrl = data.data.url;
            // Panggil fungsi proses dengan URL yang baru didapat
            processRemoveBg(imageUrl);
        } else {
            throw new Error(data.error.message || 'Gagal mengunggah gambar ke ImgBB.');
        }
    } catch (error) {
        displayError(document.getElementById('remove-bg-result-area'), error);
    }
}

async function handleImageToQrUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // --- Logika Loading yang Diperbaiki ---
    qrCodePlaceholder.classList.remove('hidden');
    qrCodePlaceholder.textContent = 'Mengunggah gambar...'; // Tampilkan status di placeholder
    qrCodeDisplayArea.classList.add('hidden'); // Sembunyikan area hasil sementara
    downloadQrCodeButton.classList.add('hidden');
    
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();

        if (data.success) {
            const imageUrl = data.data.url;
            showToast('Upload berhasil! Membuat Kode QR...', 'success');
            // Panggil fungsi generateQRCode dengan URL gambar sebagai isinya
            generateQRCode(imageUrl);
        } else {
            throw new Error(data.error.message || 'Gagal mengunggah gambar.');
        }
    } catch (error) {
        // Jika upload gagal, tampilkan error di area hasil
        qrCodeDisplayArea.classList.remove('hidden');
        qrCodePlaceholder.classList.add('hidden');
        displayError(qrCodeDisplayArea, error);
    }
}

    function displayGimageResults() {
        const start = gimageCurrentPage * RESULTS_PER_PAGE;
        const end = start + RESULTS_PER_PAGE;
        const paginatedItems = gimageResults.slice(start, end);
        const gridContainer = gimageSearchResultArea.querySelector('.grid');
        const resultsHTML = paginatedItems.map((imageObject, index) => {
            if (typeof imageObject === 'object' && imageObject.url) {
                const filename = `google_image_${Date.now()}_${start + index}.jpg`;
                return `<div class="bg-gradient-to-br p-2 flex flex-col">
                            <img src="${imageObject.url}" alt="Gambar" class="w-full h-40 object-cover rounded-lg mb-2">
                            <div class="flex items-center space-x-2 mt-auto">
                                ${createShareButtonHTML({ url: imageObject.url, title: 'Gambar dari Google' })}
                                <button data-url="${imageObject.url}" data-filename="${filename}" class="add-to-queue-button"><i class="fas fa-plus"></i></button>
                                <button data-url="${imageObject.url}" data-filename="${filename}" class="dl-gimage-button bg-green-600 text-white flex-1 flex items-center justify-center rounded-lg"><i class="fas fa-download"></i></button>
                            </div>
                        </div>`;
            }
            return '';
        }).join('');
        gridContainer.insertAdjacentHTML('beforeend', resultsHTML);
        const loadMoreContainer = document.getElementById('gimage-load-more-container');
        if (end < gimageResults.length) {
            loadMoreContainer.innerHTML = `<button class="load-more-button">Muat Lebih Banyak</button>`;
        } else {
            loadMoreContainer.innerHTML = '';
        }
    }

// === TAMBAHKAN BLOK INI DI DALAM DOMContentLoaded ===

// Fungsi untuk menangani pencarian fitur
function handleFeatureSearch() {
    // Ambil teks pencarian, ubah ke huruf kecil
    const searchTerm = featureSearchInput.value.toLowerCase();

    // Ambil semua item fitur
    const featureItems = document.querySelectorAll('.feature-grid li');

    // Loop melalui setiap item
    featureItems.forEach(item => {
        // Ambil teks dari item tersebut, ubah ke huruf kecil
        const itemText = item.textContent.toLowerCase();

        // Jika teks item mengandung teks pencarian, tampilkan. Jika tidak, sembunyikan.
        if (itemText.includes(searchTerm)) {
            item.style.display = ''; // Tampilkan item
        } else {
            item.style.display = 'none'; // Sembunyikan item
        }
    });
}

// Tambahkan event listener ke kolom pencarian
// Kita gunakan 'input' agar langsung bereaksi saat pengguna mengetik/menghapus
if (featureSearchInput) {
    featureSearchInput.addEventListener('input', handleFeatureSearch);
}

// ===============================================

async function fetchAdminDownload() {
    displayLoading(adminDownloadResultArea, fetchAdminDownloadButton, 'card');
    try {
        const url = validateInput(adminDownloadUrlInput, 'url');
        const response = await fetch(`${API_BASE_URL}/download/xnxx?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (!data.status || !data.result || !data.result.files) {
            throw new Error(data.message || 'Gagal mengambil data dari URL khusus.');
        }

        const result = data.result;
        const title = result.title || 'Video Khusus';
        const filename = title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 60);

        // Perubahan di sini: Mengganti <img> dengan <video>
        adminDownloadResultArea.innerHTML = `
            <div class="bg-gradient-to-br p-4 rounded-lg">
                <p class="font-bold text-lg mb-2 truncate">${title}</p>
                <video src="${result.files.high || result.files.low}" poster="${result.image}" controls class="w-full rounded-lg mb-4 border"></video>
                <div class="space-y-2">
                    <div class="flex items-center space-x-2">
                        <button data-url="${result.files.high}" data-filename="${filename}_high.mp4" class="new-dl-button flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download (High)</button>
                        <button class="add-to-queue-button" data-url="${result.files.high}" data-filename="${filename}_high.mp4"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button data-url="${result.files.low}" data-filename="${filename}_low.mp4" class="new-dl-button flex-1 text-center bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download (Low)</button>
                        <button class="add-to-queue-button" data-url="${result.files.low}" data-filename="${filename}_low.mp4"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <div class="mt-4 flex justify-center">
                    ${createShareButtonHTML({ url: result.URL, title: title, text: "Lihat video ini." })}
                </div>
            </div>
        `;
    } catch (error) {
        displayError(adminDownloadResultArea, error);
    } finally {
        fetchAdminDownloadButton.disabled = false;
        fetchAdminDownloadButton.textContent = 'Proses Link';
    }
}

function displayAdminResults() {
    const start = adminCurrentPage * RESULTS_PER_PAGE;
    const end = start + RESULTS_PER_PAGE;
    const paginatedItems = adminResults.slice(start, end);
    const gridContainer = adminSearchResultArea.querySelector('.grid');

    if (!gridContainer) {
        console.error("Grid container for admin results not found!");
        return;
    }

    const resultsHTML = paginatedItems.map(item => {
        const title = item.title || "Tanpa Judul";
        const info = item.info || "";
        const link = item.link || "#";
        // Di sini kita ubah tombol "Download" menjadi tombol "Proses" yang akan memanggil downloader
        const downloaderButtonHTML = `<button data-url="${link}" class="admin-process-link-btn flex-1 text-center bg-red-600 text-white font-semibold py-1 px-2 rounded-lg text-sm"><i class="fas fa-arrow-down mr-1"></i> Proses & Unduh</button>`;

        return `<div class="admin-result-item flex flex-col justify-between">
                    <div>
                        <p class="admin-result-title">${title}</p>
                        <p class="admin-result-info">${info}</p>
                    </div>
                    <div class="flex items-center space-x-2 mt-3">
                        ${createShareButtonHTML({ url: link, title: title })}
                        ${downloaderButtonHTML}
                    </div>
                </div>`;
    }).join('');

    gridContainer.insertAdjacentHTML('beforeend', resultsHTML);

    const loadMoreContainer = document.getElementById('admin-load-more-container');
    if (end < adminResults.length) {
        loadMoreContainer.innerHTML = `<button class="load-more-button">Muat Lebih Banyak (${end}/${adminResults.length})</button>`;
    } else {
        loadMoreContainer.innerHTML = '';
    }
}




function showToast(text, type = 'info') {
    const colors = {
        info: "linear-gradient(to right, #00b09b, #96c93d)",
        success: "linear-gradient(to right, #00b09b, #96c93d)",
        warning: "linear-gradient(to right, #f2994a, #f2c94c)",
        error: "linear-gradient(to right, #ff5f6d, #ffc371)",
    };

    Toastify({
        text: text,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: colors[type] || colors['info'],
        }
    }).showToast();

    // --- BAGIAN BARU UNTUK MEMUTAR SUARA ---
    // Hanya putar suara jika tipenya bukan 'error' (karena error sudah punya suara sendiri dari modal)
    if (type !== 'error') {
        const audioPlayer = document.getElementById('success-audio-player');
        if (audioPlayer) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        }
    }
}

function setupInputPersistence(inputElement, storageKey) {
    if (!inputElement) return;

    const savedValue = localStorage.getItem(storageKey);
    if (savedValue) {
        inputElement.value = savedValue;
    }

    let debounceTimer;
    inputElement.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            localStorage.setItem(storageKey, e.target.value);
        }, 500); // Simpan setelah 500ms tidak ada ketikan
    });
}

async function searchAdminContent() {
    displayLoading(adminSearchResultArea, searchAdminButton, 'grid');
    try {
        const query = validateInput(adminSearchQuery);
        adminResults = [];
        adminCurrentPage = 0;
        adminSearchResultArea.innerHTML = '<div class="grid grid-cols-2 gap-4"></div>';
        if (window.autoAnimate) autoAnimate(adminSearchResultArea.querySelector('.grid'));
        document.getElementById('admin-load-more-container').innerHTML = '';

        const response = await fetch(`${API_BASE_URL}/search/xnxx?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (!data.status || !data.result || data.result.length === 0) {
            throw new Error("Pencarian khusus gagal atau tidak ada hasil.");
        }
        adminResults = data.result;
        displayAdminResults();
    } catch (error) {
        displayError(adminSearchResultArea, error);
    } finally {
        searchAdminButton.disabled = false;
        searchAdminButton.innerHTML = 'Cari';
    }
}

async function fetchWebToPdf() {
    displayLoading(webToPdfResultArea, fetchWebToPdfButton, 'card');
    try {
        const url = validateInput(webToPdfUrlInput, 'url');
        
        // Kita gunakan API dari Vyturex yang simpel
        const apiUrl = `https://api.vyturex.com/html2pdf?url=${encodeURIComponent(url)}`;
        // Kita gunakan proxy untuk menghindari masalah CORS
        const proxiedApiUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;

        const response = await fetch(proxiedApiUrl);
        const data = await response.json();

        if (!data.status || !data.pdfUrl) {
            throw new Error(data.message || 'Gagal mengubah halaman menjadi PDF. API mungkin bermasalah.');
        }

        const pdfUrl = data.pdfUrl;
        const filename = `${new URL(url).hostname}.pdf`;

        webToPdfResultArea.innerHTML = `
            <div class="result-card">
                <i class="fas fa-file-pdf"></i>
                <p>File PDF untuk halaman ${new URL(url).hostname} telah siap!</p>
                <button data-url="${pdfUrl}" data-filename="${filename}" class="new-dl-button w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg">
                    <i class="fas fa-download mr-2"></i>Download PDF
                </button>
            </div>
        `;
    } catch (error) {
        displayError(webToPdfResultArea, error);
    } finally {
        fetchWebToPdfButton.disabled = false;
        fetchWebToPdfButton.innerHTML = '<i class="fas fa-file-export mr-2"></i>Ubah ke PDF';
    }
}

async function shortenUrl() {
    // Tampilkan loading hanya di tombol, dan sembunyikan hasil lama
    displayLoading(null, shortenUrlButton); 
    shortUrlResultArea.classList.add('hidden');

    try {
        const longUrl = validateInput(longUrlInput, 'url');
        
        // API dari TinyURL, sangat simpel dan tidak perlu kunci
        const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`;
        
        // Kita gunakan proxy untuk jaga-jaga dari masalah CORS di beberapa jaringan
        const proxiedApiUrl = `https://api.codetabs.com/v1/proxy?quest=${apiUrl}`;
        
        const response = await fetch(proxiedApiUrl);
        
        if (!response.ok) {
            throw new Error('Gagal menghubungi server TinyURL.');
        }

        // API ini mengembalikan hasil sebagai teks biasa, bukan JSON
        const shortUrl = await response.text();

        // Tampilkan hasilnya
        shortUrlText.textContent = shortUrl;
        shortUrlText.href = shortUrl;
        shortUrlResultArea.classList.remove('hidden');

    } catch (error) {
        // Kita gunakan area hasil untuk menampilkan pesan error
        shortUrlResultArea.classList.remove('hidden');
        displayError(shortUrlResultArea, error);
        // Kosongkan link hasil jika error
        shortUrlText.textContent = '';
        shortUrlText.href = '#';
    } finally {
        shortenUrlButton.disabled = false;
        shortenUrlButton.textContent = 'Perpendek Link';
    }
}

// --- FUNGSI BARU UNTUK TOMBOL SALIN ---
function copyShortUrl() {
    const urlToCopy = shortUrlText.textContent;
    if (urlToCopy) {
        navigator.clipboard.writeText(urlToCopy).then(() => {
            showToast('Link pendek berhasil disalin!', 'success');
            // Ubah teks tombol sementara untuk memberi feedback
            copyShortUrlButton.innerHTML = 'Tersalin!';
            setTimeout(() => {
                 copyShortUrlButton.innerHTML = '<i class="fas fa-copy mr-1"></i> Salin';
            }, 2000);
        }).catch(err => {
            console.error('Gagal menyalin:', err);
            showToast('Gagal menyalin link.', 'error');
        });
    }
}

    function displayPinterestResults() {
        const start = pinterestCurrentPage * RESULTS_PER_PAGE;
        const end = start + RESULTS_PER_PAGE;
        const paginatedItems = pinterestResults.slice(start, end);
        const gridContainer = pinterestResultArea.querySelector('.grid');
        const resultsHTML = paginatedItems.map((item, index) => {
            const downloadUrl = item.image;
            if (!downloadUrl) return '';
            const description = item.caption || `Pinterest Image ${start + index + 1}`;
            const customNamePart = pinterestCustomFilenameInput.value.trim();
            let finalBaseFilename = customNamePart ? `${customNamePart}_${start + index + 1}` : (description.replace(/[<>:"/\\|?*]/g, '_').substring(0, 40) || `pinterest_media_${Date.now()}_${start + index + 1}`);
            const finalFilename = `ByVintex - ${finalBaseFilename}.jpg`;
            return `<div class="bg-gradient-to-br p-2 flex flex-col">
                        <img src="${downloadUrl}" alt="${description}" class="w-full h-48 object-cover rounded-lg mb-2">
                        <div class="flex-1 min-w-0">
                           <p class="text-xs mb-2 truncate" title="${description}">${description}</p>
                        </div>
                        <div class="flex items-center space-x-2 mt-auto">
                           ${createShareButtonHTML({ featureId: 'pinterest-vintex', url: downloadUrl, title: description })}
                           <button data-url="${downloadUrl}" data-filename="${finalFilename}" class="add-to-queue-button"><i class="fas fa-plus"></i></button>
                           <button data-url="${downloadUrl}" data-filename="${finalFilename}" class="download-button-pin flex-1 text-center bg-red-600 text-white font-semibold py-1 px-2 rounded-lg text-sm"><i class="fas fa-download mr-1"></i>Download</button>
                        </div>
                    </div>`;
        }).join('');
        gridContainer.insertAdjacentHTML('beforeend', resultsHTML);
        const loadMoreContainer = document.getElementById('pinterest-load-more-container');
        if (end < pinterestResults.length) {
            loadMoreContainer.innerHTML = `<button class="load-more-button">Muat Lebih Banyak (${end}/${pinterestResults.length})</button>`;
        } else {
            loadMoreContainer.innerHTML = '';
        }
    }
    
    async function searchSpotify() {
        displayLoading(spotifySearchResultArea, searchSpotifyButton, 'list');
        try {
            const query = validateInput(spotifySearchQuery);
            spotifyResults = [];
            spotifyCurrentPage = 0;
            spotifySearchResultArea.innerHTML = '';
            document.getElementById('spotify-load-more-container').innerHTML = '';
            const response = await fetch(`${API_BASE_URL}/search/spotify?query=${encodeURIComponent(query)}`);
            const json = await response.json();
            if (!json.status || !json.result || json.result.length === 0) {
                throw new Error("Pencarian tidak berhasil atau tidak ada hasil.");
            }
            spotifyResults = json.result;
            displaySpotifyResults();
        } catch (error) {
            displayError(spotifySearchResultArea, error);
        } finally {
            searchSpotifyButton.disabled = false;
            searchSpotifyButton.innerHTML = 'Cari';
        }
    }


async function fetchOpenAiChat() {
    displayLoading(openAiResultArea, fetchOpenAiButton);
    try {
        const text = validateInput(openAiPromptInput);
        const response = await fetch(`${API_BASE_URL}/ai/openai?text=${encodeURIComponent(text)}`);
        
        const textResponse = await response.text();
        let data;
        try {
            data = JSON.parse(textResponse);
        } catch (e) {
            throw new Error("API merespons dengan format yang tidak valid (kemungkinan halaman error).");
        }

        if (!data.status || !data.result) {
            throw new Error(data.message || "Gagal mendapatkan jawaban dari OpenAI.");
        }
        
        openAiResultArea.textContent = data.result;
    } catch (error) {
        displayError(openAiResultArea, error);
    } finally {
        fetchOpenAiButton.disabled = false;
        fetchOpenAiButton.textContent = 'Kirim';
    }
}

async function fetchMultiModelChat() {
    displayLoading(multiModelResultArea, fetchMultiModelButton);
    try {
        const prompt = validateInput(multiModelPromptInput);
        const model = multiModelSelect.value;
        const response = await fetch(`${API_BASE_URL}/ai/chatbot?prompt=${encodeURIComponent(prompt)}&model=${model}`);
        
        const textResponse = await response.text();
        let data;
        try {
            data = JSON.parse(textResponse);
        } catch (e) {
            throw new Error("API merespons dengan format yang tidak valid (kemungkinan halaman error).");
        }
        
        if (!data.status || !data.response) {
            throw new Error(data.message || "Gagal mendapatkan jawaban dari Chatbot.");
        }
        
        multiModelResultArea.textContent = data.response;
    } catch (error) {
        displayError(multiModelResultArea, error);
    } finally {
        fetchMultiModelButton.disabled = false;
        fetchMultiModelButton.textContent = 'Kirim';
    }
}

    async function searchGoogleImages() {
        displayLoading(gimageSearchResultArea, searchGimageButton, 'grid');
        try {
            const query = validateInput(gimageSearchQuery);
            gimageResults = [];
            gimageCurrentPage = 0;
            gimageSearchResultArea.innerHTML = '<div class="grid grid-cols-2 md:grid-cols-3 gap-3"></div>';
            if(window.autoAnimate) autoAnimate(gimageSearchResultArea.querySelector('.grid'));
            document.getElementById('gimage-load-more-container').innerHTML = '';
            const response = await fetch(`${API_BASE_URL}/search/gimage?q=${encodeURIComponent(query)}`);
            const json = await response.json();
            if (!json.status || !json.result || json.result.length === 0) {
                throw new Error("Pencarian gambar gagal atau tidak ada hasil.");
            }
            gimageResults = json.result;
            displayGimageResults();
        } catch (error) {
            displayError(gimageSearchResultArea, error);
        } finally {
            searchGimageButton.disabled = false;
            searchGimageButton.innerHTML = 'Cari Gambar';
        }
    }
    
    async function fetchPinterestMedia() {
        displayLoading(pinterestResultArea, fetchPinterestMediaButton, 'grid');
        try {
            const query = validateInput(pinterestUrlInput);
            pinterestResults = [];
            pinterestCurrentPage = 0;
            pinterestResultArea.innerHTML = '<div class="grid grid-cols-2 md:grid-cols-3 gap-4"></div>';
            if(window.autoAnimate) autoAnimate(pinterestResultArea.querySelector('.grid'));
            document.getElementById('pinterest-load-more-container').innerHTML = '';
            const apiUrl = `https://api.ownblox.my.id/api/pinterest?q=${encodeURIComponent(query)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status !== 200 || !Array.isArray(data.results) || data.results.length === 0) {
                throw new Error('Tidak ada hasil yang ditemukan atau terjadi kesalahan pada API.');
            }
            pinterestResults = data.results;
            displayPinterestResults();
        } catch (error) {
            displayError(pinterestResultArea, error);
        } finally {
            fetchPinterestMediaButton.disabled = false;
            fetchPinterestMediaButton.textContent = 'Download';
        }
    }

function renderApiStatusPage() {
    if (!apiStatusListArea) return;

    // Urutkan berdasarkan nama ID
    const sortedApiIds = Object.keys(apiStatusData).sort();
    
    if (sortedApiIds.length === 0) {
        apiStatusListArea.innerHTML = `<p class="text-center">Belum ada data status. Coba segarkan.</p>`;
        return;
    }

    apiStatusListArea.innerHTML = sortedApiIds.map(id => {
        const data = apiStatusData[id];
        let statusText, statusClass, latencyText;

        switch (data.status) {
            case 'good':
                statusText = 'Bagus';
                statusClass = 'good';
                latencyText = `${data.latency} ms`;
                break;
            case 'slow':
                statusText = 'Lambat';
                statusClass = 'slow';
                latencyText = `${data.latency} ms`;
                break;
            case 'error':
            default:
                statusText = 'Eror';
                statusClass = 'error';
                latencyText = 'N/A';
                break;
        }

        return `
            <div class="api-status-item ${statusClass}">
                <div class="api-status-item-info">
                    <p class="api-status-item-name">${id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    <p class="api-status-item-url">${apiEndpoints[id].url}</p>
                </div>
                <div class="api-status-item-details">
                    <span class="status-badge ${data.status}">${statusText}</span>
                    <p class="api-status-item-latency">${latencyText}</p>
                </div>
            </div>
        `;
    }).join('');
}

async function checkApiStatus(isInitialLoad = false) {
    const buttonIcon = isInitialLoad 
        ? (document.getElementById('show-settings-button') ? document.getElementById('show-settings-button').querySelector('i') : null)
        : (refreshApiStatusButton ? refreshApiStatusButton.querySelector('i') : null);

    if (buttonIcon) {
        buttonIcon.classList.add('spin');
    }
    
    // Jika di halaman status, tampilkan skeleton loading
    if (!isInitialLoad && document.getElementById('api-status-page').style.opacity === '1') {
        apiStatusListArea.innerHTML = Array(Object.keys(apiEndpoints).length).fill('').map(() => `
            <div class="flex items-center space-x-4 p-2">
                <div class="flex-1 space-y-2">
                    <div class="skeleton text w-1/4"></div>
                    <div class="skeleton text w-3/4"></div>
                </div>
                <div class="skeleton text w-1/6"></div>
            </div>
        `).join('');
    }

    const promises = Object.keys(apiEndpoints).map(async (id) => {
        const statusDot = document.querySelector(`.api-status[data-api-id="${id}"]`);
        try {
            const startTime = performance.now();
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 detik timeout

            const proxiedApiUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(apiEndpoints[id].url)}`;
            const response = await fetch(proxiedApiUrl, { signal: controller.signal });
            
            clearTimeout(timeoutId);
            const endTime = performance.now();
            const latency = Math.round(endTime - startTime);

            if (response.ok) {
                if (latency > 1500) { // Anggap lebih dari 1.5 detik itu lambat
                    apiStatusData[id] = { status: 'slow', latency: latency };
                } else {
                    apiStatusData[id] = { status: 'good', latency: latency };
                }
            } else {
                apiStatusData[id] = { status: 'error', latency: null };
            }
        } catch (error) {
            console.warn(`Pengecekan status API gagal untuk ${id}:`, error.name);
            apiStatusData[id] = { status: 'error', latency: null };
        }
        
        // Update dot di halaman utama
        if (statusDot) {
            statusDot.classList.remove('online', 'offline', 'slow');
            if (apiStatusData[id].status === 'good') statusDot.classList.add('online');
            else if (apiStatusData[id].status === 'slow') statusDot.classList.add('slow');
            else statusDot.classList.add('offline');
        }
    });

    await Promise.all(promises);

    // Render ulang halaman status jika sedang ditampilkan
    if (document.getElementById('api-status-page').style.opacity === '1') {
       renderApiStatusPage();
    }
    
    if (buttonIcon) {
        setTimeout(() => buttonIcon.classList.remove('spin'), 1000);
    }
}

async function handleSharedUrl() {
    const params = new URLSearchParams(window.location.search);
    const feature = params.get('feature');
    const mediaUrl = params.get('mediaUrl');

    if (feature && mediaUrl) {
        const viewerPage = document.getElementById('viewer-page');
        const viewerContentArea = document.getElementById('viewer-content-area');
        const viewerTitle = document.getElementById('viewer-title');

        if (!viewerPage) return;

        showPage(viewerPage);
        viewerTitle.textContent = 'Memuat Konten...';
        viewerContentArea.innerHTML = `<div class="flex justify-center items-center"><div class="animate-spin rounded-full h-10 w-10 border-b-2"></div></div>`;

        try {
            let finalMedia;

            // --- LOGIKA PEMANGGILAN API YANG SUDAH DIPERBAIKI ---
            
            if (feature === 'tiktok-vintex') {
                const response = await fetch(`https://api.ownblox.my.id/api/ttdl?url=${encodeURIComponent(mediaUrl)}`);
                const data = await response.json();
                if (!data.status || !data.result) throw new Error('API TikTok (Vintex) gagal.');
                const videoData = data.result;
                finalMedia = { type: 'video', url: videoData.video, title: videoData.title || 'Video TikTok', downloadUrl: videoData.video, filename: 'tiktok-vintex.mp4' };
            
            } else if (feature === 'tiktok-v2') {
                const response = await fetch(`${API_BASE_URL}/download/tiktok?url=${encodeURIComponent(mediaUrl)}`);
                const data = await response.json();
                if (!data.status || (data.result && data.result.code !== 0)) throw new Error(data.result.msg || 'API TikTok (V2) gagal.');
                const videoData = data.result.data;
                finalMedia = { type: 'video', url: videoData.play, title: videoData.title || 'Video TikTok', downloadUrl: videoData.play, filename: 'tiktok-v2.mp4' };
            
            } else if (feature.includes('instagram')) {
                const response = await fetch(`${API_BASE_URL}/download/instagram?url=${encodeURIComponent(mediaUrl)}`);
                const data = await response.json();
                if (!data.status || !data.result.downloadUrls) throw new Error('API Instagram gagal.');
                const firstMediaUrl = data.result.downloadUrls[0];
                const isVideo = firstMediaUrl.includes('.mp4');
                finalMedia = { type: isVideo ? 'video' : 'image', url: firstMediaUrl, title: data.result.title || 'Postingan Instagram', downloadUrl: firstMediaUrl, filename: 'instagram-media' + (isVideo ? '.mp4' : '.jpg') };
            
            } else if (feature.includes('pinterest') || feature === 'gimage') {
                finalMedia = { type: 'image', url: mediaUrl, title: 'Gambar Dibagikan', downloadUrl: mediaUrl, filename: 'shared-image.jpg' };
            
            } else {
                throw new Error(`Fitur '${feature}' tidak didukung untuk tampilan pratinjau.`);
            }

            // --- RENDER KONTEN KE HALAMAN VIEWER ---
            viewerTitle.textContent = finalMedia.title;
            let mediaHTML = '';
            if (finalMedia.type === 'image') {
                mediaHTML = `<img src="${finalMedia.url}" class="max-w-full max-h-full rounded-lg shadow-lg object-contain">`;
            } else if (finalMedia.type === 'video') {
                mediaHTML = `<video src="${finalMedia.url}" controls autoplay class="max-w-full max-h-full rounded-lg shadow-lg"></video>`;
            }

            viewerContentArea.innerHTML = `
                <div class="text-center">
                    <div class="mb-4">${mediaHTML}</div>
                    <button data-url="${finalMedia.downloadUrl}" data-filename="${finalMedia.filename}" class="new-dl-button bg-blue-600 text-white font-bold py-2 px-6 rounded-lg">
                        <i class="fas fa-download mr-2"></i>Download
                    </button>
                </div>`;

        } catch (error) {
            console.error("Gagal memuat konten untuk viewer:", error);
            viewerTitle.textContent = 'Gagal Memuat';
            viewerContentArea.innerHTML = `<div class="error-box"><p class="error-title">Gagal memuat konten</p><p class="error-message">${error.message}</p></div>`;
        }
    }
}

    async function fetchTTS() {
    displayLoading(ttsResultArea, fetchTtsButton, 'card');
    try {
        const text = validateInput(ttsTextInput);
        const response = await fetch(`${API_BASE_URL}/tools/text-to-speech?text=${encodeURIComponent(text)}`);
        const data = await response.json();
        if (data.status !== true || !Array.isArray(data.result) || data.result.length === 0) {
            throw new Error('Gagal mendapatkan data suara dari API.');
        }

        // --- Perubahan dimulai di sini ---
        let resultHTML = data.result.map(voice => {
            const voiceName = voice.voice_name;
            let audioUrl = Object.values(voice).find(val => typeof val === 'string' && val.endsWith('.wav'));
            if (voiceName && audioUrl) {
                const baseFilename = `${voiceName.replace(/ /g, '_')}_TTS`;
                
                return `<div class="bg-gradient-to-br p-3 flex items-center space-x-2">
                            <div class="flex-1">
                                <p class="font-semibold mb-2">${voiceName}</p>
                                <audio controls class="w-full mb-3" src="${audioUrl}"></audio>
                                <div class="grid grid-cols-2 gap-2">
                                    
                                    <button data-url="${audioUrl}" data-filename="${baseFilename}.wav" class="new-dl-button flex items-center justify-center text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm">
                                        <i class="fas fa-music mr-2"></i>Audio
                                    </button>
                                    
                                    <button data-url="${audioUrl}" data-filename="${baseFilename}_VN.ogg" class="vn-dl-button flex items-center justify-center text-center bg-green-600 text-white font-semibold py-2 px-4 rounded-lg text-sm">
                                        <i class="fab fa-whatsapp mr-2"></i>VN
                                    </button>
                                </div>
                            </div>
                        </div>`;
            }
            return '';
        }).join('');
        // --- Akhir dari perubahan ---

        ttsResultArea.innerHTML = `<div class="space-y-3">${resultHTML}</div>`;
    } catch (error) {
        displayError(ttsResultArea, error);
    } finally {
        fetchTtsButton.disabled = false;
        fetchTtsButton.textContent = 'Ubah ke Suara';
    }
}

async function convertToVN(wavUrl, newFilename, buttonElement) {
    const originalText = buttonElement.innerHTML;
    buttonElement.disabled = true;
    buttonElement.innerHTML = `<div class="animate-spin rounded-full h-4 w-4 border-b-2"></div><span class="ml-2">Proses...</span>`;
    showToast("Memulai konversi ke VN, mohon tunggu...", "info");

    try {
        const { FFmpeg, FFmpegUtil } = window.FFmpeg;
        const { fetchFile } = FFmpegUtil;
        
        const ffmpeg = new FFmpeg();
        ffmpeg.on('log', ({ message }) => {
            console.log(`[FFMPEG LOG]: ${message}`); // Log ini boleh ditinggal, berguna untuk melihat proses
        });
        await ffmpeg.load();

        const proxiedWavUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(wavUrl)}`;
        showToast("Mengunduh file via proxy...", "info");
        const wavData = await fetchFile(proxiedWavUrl);
        
        await ffmpeg.writeFile('input.wav', wavData);

        showToast("Mengonversi ke format VN...", "info");
        await ffmpeg.exec(['-i', 'input.wav', '-c:a', 'libopus', 'output.ogg']);

        const oggData = await ffmpeg.readFile('output.ogg');
        
        const blob = new Blob([oggData.buffer], { type: 'audio/ogg' });
        const objectUrl = URL.createObjectURL(blob);

        const tempLink = document.createElement('a');
        tempLink.href = objectUrl;
        tempLink.download = newFilename;
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        URL.revokeObjectURL(objectUrl);
        
        showToast("Konversi VN berhasil!", "success");
        saveToHistory(newFilename, wavUrl, 'audio');

    } catch (error) {
        console.error("Kesalahan saat konversi VN:", error);
        displayError(ttsResultArea, new Error("Gagal mengonversi audio ke format VN. Silakan coba lagi."));
        showToast("Gagal mengonversi ke VN.", "error");
    } finally {
        buttonElement.disabled = false;
        buttonElement.innerHTML = originalText;
    }
}

    async function fetchTikTokInfoV2() {
        displayLoading(tiktokV2ResultArea, fetchTiktokV2Button, 'card');
        try {
            const url = validateInput(tiktokV2UrlInput, 'tiktok');
            const response = await fetch(`${API_BASE_URL}/download/tiktok?url=${encodeURIComponent(url)}`);
            const json = await response.json();
            if (!json.status || json.result.code !== 0) throw new Error(json.result.msg || 'Gagal mengambil data TikTok.');
            const data = json.result.data;
            const baseFilename = (data.title || `tiktok_v2_${data.id}`).replace(/[<>:"/\\|?*]/g, '_').substring(0, 50);
            let buttonsHTML = '';
            if (data.play) buttonsHTML += `<button data-url="${data.play}" data-filename="${baseFilename}_NoWM.mp4" class="new-dl-button flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-video mr-2"></i>Video (No WM)</button>`;
            if (data.hdplay) buttonsHTML += `<button data-url="${data.hdplay}" data-filename="${baseFilename}_HD.mp4" class="new-dl-button flex-1 text-center bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-high-definition mr-2"></i>Video (HD)</button>`;
            if (data.wmplay) buttonsHTML += `<button data-url="${data.wmplay}" data-filename="${baseFilename}_WM.mp4" class="new-dl-button flex-1 text-center bg-gray-600 font-semibold py-2 px-4 rounded-lg"><i class="fas fa-tint mr-2"></i>Video (WM)</button>`;
            if (data.music) buttonsHTML += `<button data-url="${data.music}" data-filename="${baseFilename}_Music.mp3" class="new-dl-button flex-1 text-center bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-music mr-2"></i>Audio (MP3)</button>`;
            tiktokV2ResultArea.innerHTML = `<div class="bg-gradient-to-br p-4">
                <p class="font-semibold mb-1 truncate" title="${data.title}">${data.title || 'Video TikTok'}</p>
                <p class="text-sm mb-4">by: ${data.author.nickname}</p>
                <video class="w-full rounded-lg mb-4" controls poster="${data.cover}" src="${data.play}"></video>
                <div class="flex items-center space-x-2">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">${buttonsHTML}</div>
                    <div class="flex flex-col space-y-2">
                        ${createShareButtonHTML({ url: data.play, title: data.title, text: "Lihat video TikTok ini!" })}
                        <button class="add-to-queue-button" data-url="${data.play}" data-filename="${baseFilename}_NoWM.mp4"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
            </div>`;
        } catch (error) {
            displayError(tiktokV2ResultArea, error);
        } finally {
            fetchTiktokV2Button.disabled = false;
            fetchTiktokV2Button.textContent = 'Download';
        }
    }
    
    async function fetchInstagramMediaV2() {
        displayLoading(instagramV2ResultArea, fetchInstagramV2Button, 'card');
        try {
            const url = validateInput(instagramV2UrlInput, 'instagram');
            const response = await fetch(`${API_BASE_URL}/download/instagram?url=${encodeURIComponent(url)}`);
            const json = await response.json();
            if (!json.status || !json.result.downloadUrls) throw new Error(json.message || 'Gagal mengambil data Instagram.');
            const data = json.result;
            let resultHTML = `<h3 class="font-semibold mb-2 truncate">${data.title || 'Postingan Instagram'}</h3>`;
            data.downloadUrls.forEach((dlUrl, index) => {
                const filename = `${(data.title || `instagram_v2_${Date.now()}`).replace(/[<>:"/\\|?*]/g, '_').substring(0, 40)}_${index + 1}.mp4`;
                resultHTML += `<div class="bg-gradient-to-br p-4 mb-3">
                    <p class="mb-2">Media ${index + 1}</p>
                    <video class="w-full rounded-lg mb-4" controls src="${dlUrl}"></video>
                    <div class="flex items-center space-x-2">
                        <button data-url="${dlUrl}" data-filename="${filename}" class="new-dl-button flex-1 text-center bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download Media ${index + 1}</button>
                        <button class="add-to-queue-button" data-url="${dlUrl}" data-filename="${filename}"><i class="fas fa-plus"></i></button>
                        ${createShareButtonHTML({ url: dlUrl, title: `Postingan Instagram ${index + 1}`})}
                    </div>
                </div>`;
            });
            instagramV2ResultArea.innerHTML = resultHTML;
        } catch (error) {
            displayError(instagramV2ResultArea, error);
        } finally {
            fetchInstagramV2Button.disabled = false;
            fetchInstagramV2Button.textContent = 'Download';
        }
    }

    async function fetchPinterestMediaV2() {
        displayLoading(pinterestV2ResultArea, fetchPinterestV2Button, 'grid');
        try {
            const url = validateInput(pinterestV2UrlInput, 'pinterest');
            const response = await fetch(`${API_BASE_URL}/download/pinterest?url=${encodeURIComponent(url)}`);
            const json = await response.json();
            if (!json.status || !json.results) throw new Error(json.message || 'Gagal mengambil data Pinterest.');
            let resultHTML = json.results.map((item, index) => {
                const filename = `pinterest_v2_${Date.now()}_${index + 1}.${item.tag === 'video' ? 'mp4' : 'jpg'}`;
                const mediaHTML = item.tag === 'video' ? `<video class="w-full h-48 object-cover rounded-lg mb-2" controls src="${item.direct}"></video>` : `<img src="${item.direct}" alt="Pinterest media" class="w-full h-48 object-cover rounded-lg mb-2">`;
                return `<div class="bg-gradient-to-br p-2 flex flex-col">${mediaHTML}
                    <div class="flex items-center space-x-2 mt-auto">
                        <button class="add-to-queue-button" data-url="${item.direct}" data-filename="${filename}"><i class="fas fa-plus"></i></button>
                        <button data-url="${item.direct}" data-filename="${filename}" class="new-dl-button flex-1 text-center bg-red-600 text-white font-semibold py-1 px-2 rounded-lg text-sm"><i class="fas fa-download mr-1"></i>Download</button>
                        ${createShareButtonHTML({ featureId: 'pinterest-v2', url: url, title: 'Gambar dari Pinterest'})}
                    </div>
                </div>`;
            }).join('');
            pinterestV2ResultArea.innerHTML = `<div class="grid grid-cols-2 md:grid-cols-3 gap-4">${resultHTML}</div>`;
        } catch (error) {
            displayError(pinterestV2ResultArea, error);
        } finally {
            fetchPinterestV2Button.disabled = false;
            fetchPinterestV2Button.textContent = 'Download';
        }
    }
    
    async function fetchSnackVideo() {
        displayLoading(snackvideoResultArea, fetchSnackvideoButton, 'card');
        try {
            const url = validateInput(snackvideoUrlInput, 'url');
            const response = await fetch(`${API_BASE_URL}/download/snackvideo?url=${encodeURIComponent(url)}`);
            const json = await response.json();
            if (!json.status || !json.result.downloadUrl) throw new Error(json.message || 'Gagal mengambil data Snack Video.');
            const data = json.result;
            const filename = `snackvideo_${Date.now()}.mp4`;
            snackvideoResultArea.innerHTML = `<div class="bg-gradient-to-br p-4">
                <video class="w-full rounded-lg mb-4" controls poster="${data.thumbnail}" src="${data.downloadUrl}"></video>
                <div class="flex items-center space-x-2">
                    <button data-url="${data.downloadUrl}" data-filename="${filename}" class="new-dl-button flex-1 text-center font-bold py-2 px-4 rounded-lg" style="background-color: #FFC400; color: black;"><i class="fas fa-download mr-2"></i>Download Video</button>
                    <button class="add-to-queue-button" data-url="${data.downloadUrl}" data-filename="${filename}"><i class="fas fa-plus"></i></button>
                    ${createShareButtonHTML({ url: data.downloadUrl, title: 'Video dari SnackVideo'})}
                </div>
            </div>`;
        } catch (error) {
            displayError(snackvideoResultArea, error);
        } finally {
            fetchSnackvideoButton.disabled = false;
            fetchSnackvideoButton.textContent = 'Download';
        }
    }

    async function fetchFacebookMedia() {
        displayLoading(facebookResultArea, fetchFacebookButton, 'card');
        try {
            const url = validateInput(facebookUrlInput, 'facebook');
            const response = await fetch(`${API_BASE_URL}/download/facebook?url=${encodeURIComponent(url)}`);
            const json = await response.json();
            if (!json.status || !json.result || !json.result.media) throw new Error(json.message || 'Gagal mengambil data Facebook. Pastikan URL valid.');
            const data = json.result;
            const info = data.info;
            const media = data.media;
            const baseFilename = (info.title || `facebook_${Date.now()}`).replace(/[<>:"/\\|?* \n]/g, '_').substring(0, 50);
            let buttonsHTML = '';
            const downloadUrl = media.video_hd || media.video_sd;
            if (media.video_sd) buttonsHTML += `<button data-url="${media.video_sd}" data-filename="${baseFilename}_SD.mp4" class="new-dl-button flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-video mr-2"></i>Download (SD)</button>`;
            if (media.video_hd) buttonsHTML += `<button data-url="${media.video_hd}" data-filename="${baseFilename}_HD.mp4" class="new-dl-button flex-1 text-center bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-high-definition mr-2"></i>Download (HD)</button>`;
            if (!buttonsHTML) throw new Error('Tidak ada link unduhan video yang ditemukan.');
            facebookResultArea.innerHTML = `<div class="bg-gradient-to-br p-4">
                <p class="font-semibold mb-3 whitespace-pre-wrap">${info.title || 'Video Facebook'}</p>
                <video class="w-full rounded-lg mb-4" controls poster="${media.thumbnail}" src="${downloadUrl}"></video>
                <div class="flex items-center space-x-2">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">${buttonsHTML}</div>
                    <button class="add-to-queue-button" data-url="${downloadUrl}" data-filename="${baseFilename}.mp4"><i class="fas fa-plus"></i></button>
                    ${createShareButtonHTML({ url: downloadUrl, title: info.title || 'Video dari Facebook'})}
                </div>
            </div>`;
        } catch (error) {
            displayError(facebookResultArea, error);
        } finally {
            fetchFacebookButton.disabled = false;
            fetchFacebookButton.textContent = 'Download';
        }
    }
// Fungsi untuk menangani konversi gambar
async function handleImageConversion() {
    const file = imageConverterInput.files[0];
    if (!file) return; // Keluar jika tidak ada file yang dipilih

    const targetFormat = imageFormatSelect.value;
    const targetExtension = targetFormat.split('/')[1];
    
    // Tampilkan loading
    imageConverterResultArea.innerHTML = `<div class="text-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"></div><p class="mt-2">Mengonversi...</p></div>`;

    try {
        // Buat objek untuk membaca file
        const reader = new FileReader();

        // Ketika file selesai dibaca
        reader.onload = function(event) {
            const img = new Image();
            
            // Ketika gambar selesai dimuat dari data
            img.onload = function() {
                // Buat canvas
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                // Gambar ke canvas
                ctx.drawImage(img, 0, 0);

                // Konversi ke format target
                const convertedImageUrl = canvas.toDataURL(targetFormat, 0.95); // 0.95 adalah kualitas untuk JPG/WEBP

                const originalFilename = file.name.substring(0, file.name.lastIndexOf('.'));
                const newFilename = `${originalFilename}_converted.${targetExtension}`;

                // Tampilkan hasilnya
                imageConverterResultArea.innerHTML = `
                    <h4 class="font-bold text-center mb-4">Hasil Konversi</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div class="text-center">
                            <p class="font-semibold mb-2">Gambar Asli</p>
                            <img src="${event.target.result}" class="w-full rounded-lg shadow-md border">
                        </div>
                        <div class="text-center">
                            <p class="font-semibold mb-2">Gambar Hasil (${targetExtension.toUpperCase()})</p>
                            <img src="${convertedImageUrl}" class="w-full rounded-lg shadow-md border">
                        </div>
                    </div>
                    <div class="text-center mt-6">
                        <a href="${convertedImageUrl}" download="${newFilename}" class="new-dl-button inline-block bg-green-600 text-white font-bold py-2 px-6 rounded-lg">
                            <i class="fas fa-download mr-2"></i>Download Hasil
                        </a>
                    </div>
                `;
            };
            img.src = event.target.result; // Set sumber gambar ke data file
        };
        
        // Baca file sebagai Data URL
        reader.readAsDataURL(file);

    } catch (error) {
        displayError(imageConverterResultArea, error);
    }
}
// GANTI FUNGSI LAMA DENGAN VERSI FINAL INI
function convertText(text, style) {
    // Cek jika ini adalah gaya spesial
    if (style.special === 'strikethrough') {
        // Tambahkan karakter coret di setiap huruf
        return text.split('').join('\u0336');
    }
    
    if (style.special === 'upside-down') {
        // Balik dulu urutan teksnya, lalu ubah setiap karakter
        let reversedText = text.split('').reverse().join('');
        let converted = '';
        const map = style.map;
        for (let i = 0; i < reversedText.length; i++) {
            const char = reversedText[i];
            converted += map[char] || char;
        }
        return converted;
    }

    // Jika bukan gaya spesial, gunakan metode peta seperti biasa
    let converted = '';
    const map = style.map;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        converted += map[char] || char;
    }
    return converted;
}

function renderFancyText() {
    const inputText = textGeneratorInput.value;
    textGeneratorResultArea.innerHTML = ''; // Kosongkan hasil

    if (!inputText.trim()) {
        textGeneratorResultArea.innerHTML = `<p class="text-center text-[var(--text-color-light)]">Hasil akan muncul di sini...</p>`;
        return;
    }

    styles.forEach(style => {
        const converted = convertText(inputText, style);
        const styleCard = document.createElement('div');
        styleCard.className = 'style-card';
        styleCard.innerHTML = `
            <div class="style-card-header">
                <span class="style-name">${style.name}</span>
                <button class="copy-style-btn" data-text-to-copy="${converted}">Salin</button>
            </div>
            <div class="style-preview-text">${converted}</div>
        `;
        textGeneratorResultArea.appendChild(styleCard);
    });
}

async function fetchSpotifySong() {
    displayLoading(spotifyResultArea, fetchSpotifyButton, 'card');
    try {
        const url = validateInput(spotifyUrlInput, 'spotify');
        // Kita ganti API di sini
        const response = await fetch(`https://api.vyturex.com/spotify?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.status !== true || !data.data) {
            throw new Error(data.mess || 'Gagal mengambil info lagu dari API baru.');
        }

        const track = data.data;
        const artistName = Array.isArray(track.artists) ? track.artists.join(', ') : track.artists;
        const filename = `${artistName} - ${track.title}.mp3`.replace(/[<>:"/\\|?*]/g, '_');
        const downloadUrl = track.url; // Link download langsung dari API baru

        if (!downloadUrl) {
            throw new Error("Link download MP3 tidak ditemukan di respons API.");
        }
        
        spotifyResultArea.innerHTML = `
            <div class="bg-gradient-to-br p-4 text-center">
                <img src="${track.thumbnail}" alt="Album Cover" class="w-40 h-40 mx-auto rounded-lg mb-4 shadow-lg">
                <h3 class="font-bold text-lg truncate">${track.title}</h3>
                <p class="mb-1">${artistName}</p>
                <p class="text-sm mb-4">Durasi: ${Math.floor(track.duration / 60000)}:${((track.duration % 60000) / 1000).toFixed(0).padStart(2, '0')}</p>
                <div class="flex items-center space-x-2">
                    <button data-url="${downloadUrl}" data-filename="${filename}" class="new-dl-button flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download MP3</button>
                    <button class="add-to-queue-button" data-url="${downloadUrl}" data-filename="${filename}"><i class="fas fa-plus"></i></button>
                    ${createShareButtonHTML({ url: url, title: `${track.title} by ${artistName}`, text: `Dengarkan di Spotify!`})}
                </div>
            </div>`;

    } catch (error) {
        displayError(spotifyResultArea, error);
    } finally {
        fetchSpotifyButton.disabled = false;
        fetchSpotifyButton.innerHTML = 'Download';
    }
}

async function downloadFromSpotifySearch(link, filename, button) {
    const originalIcon = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<div class="animate-spin rounded-full h-5 w-5 border-b-2"></div>`;
    
    try {
        const proxiedApiUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(link);
        const response = await fetch(proxiedApiUrl);
        if (!response.ok) throw new Error(`Proxy allorigins.win gagal.`);
        
        const textResponse = await response.text();
        let json;
        try {
            json = JSON.parse(textResponse);
        } catch (e) {
            throw new Error("API merespons dengan format yang tidak valid (bukan JSON).");
        }
        
        if (!json.status || !json.result || !json.result.download_url) {
            throw new Error(json.message || "Gagal mendapatkan link unduhan MP3 dari API.");
        }
        
        const downloadUrl = json.result.download_url;
        await forceDownload(downloadUrl, filename, button);

    } catch (error) {
        alert(`Gagal memulai unduhan: ${error.message}`);
    } finally {
        button.disabled = false;
        button.innerHTML = originalIcon;
    }
}

async function playFromSpotifySearch(link, title, button) {
    const playerContainer = document.getElementById('spotify-player-container');
    const audioPlayer = document.getElementById('spotify-audio-player');
    const playerTitle = document.getElementById('spotify-player-title');
    const originalIcon = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<div class="animate-spin rounded-full h-5 w-5 border-b-2"></div>`;

    try {
        const proxiedApiUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(link);
        const response = await fetch(proxiedApiUrl);
        if (!response.ok) throw new Error(`Proxy allorigins.win gagal.`);

        const textResponse = await response.text();
        let json;
        try {
            json = JSON.parse(textResponse);
        } catch (e) {
            throw new Error("API merespons dengan format yang tidak valid (bukan JSON).");
        }

        if (!json.status || !json.result || !json.result.download_url) {
            throw new Error(json.message || "Gagal mengambil link audio dari API.");
        }
        
        playerTitle.textContent = `Now Playing: ${title}`;
        const audioUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(json.result.download_url);
        audioPlayer.src = audioUrl;
        playerContainer.classList.remove('hidden');
        if(window.autoAnimate) autoAnimate(playerContainer);
        audioPlayer.play();
        playerContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (error) {
        alert(`Error saat memutar lagu: ${error.message}`);
    } finally {
        button.disabled = false;
        button.innerHTML = originalIcon;
    }
}

    async function searchPlayStore() {
        displayLoading(playstoreSearchResultArea, searchPlaystoreButton, 'list');
        try {
            const query = validateInput(playstoreSearchQuery);
            const response = await fetch(`${API_BASE_URL}/search/playstore?q=${encodeURIComponent(query)}`);
            const json = await response.json();
            if (!json.status || !json.result) throw new Error(json.message || "Pencarian aplikasi gagal.");
            if (json.result.length === 0) {
                playstoreSearchResultArea.innerHTML = `<p class="text-center">Tidak ada aplikasi yang ditemukan untuk "${query}".</p>`;
                return;
            }
            let resultsHTML = json.result.map(app => {
                return `<div class="bg-gradient-to-br p-3 flex items-center space-x-4"><img src="${app.img}" alt="App Icon" class="w-16 h-16 rounded-xl"><div class="flex-1 min-w-0"><p class="font-semibold truncate">${app.nama}</p><p class="text-sm truncate">${app.developer}</p><p class="text-yellow-400 text-sm font-bold"><i class="fas fa-star mr-1"></i> ${app.rate2}</p></div><a href="${app.link}" target="_blank" class="bg-teal-500 text-white p-2 rounded-full"><i class="fas fa-external-link-alt"></i></a></div>`;
            }).join('');
            playstoreSearchResultArea.innerHTML = `<div class="space-y-3">${resultsHTML}</div>`;
        } catch(error) {
            displayError(playstoreSearchResultArea, error);
        } finally {
            searchPlaystoreButton.disabled = false;
            searchPlaystoreButton.innerHTML = 'Cari Aplikasi';
        }
    }

    async function searchFDroid() {
        displayLoading(fdroidSearchResultArea, searchFdroidButton, 'list');
        try {
            const query = validateInput(fdroidSearchQuery);
            const response = await fetch(`${API_BASE_URL}/search/fdroid?q=${encodeURIComponent(query)}`);
            const json = await response.json();
            if (!json.status) throw new Error(json.message || "Pencarian F-Droid gagal.");
            if (!json.result || json.result.length === 0) {
                fdroidSearchResultArea.innerHTML = `<p class="text-center">Tidak ada aplikasi yang ditemukan untuk "${query}".</p>`;
                return;
            }
            let resultsHTML = json.result.map(app => {
                return `<div class="bg-gradient-to-br p-3 flex items-center space-x-4"><div class="w-16 h-16 rounded-xl bg-gray-600 flex items-center justify-center"><i class="fas fa-box-open text-3xl"></i></div><div class="flex-1 min-w-0"><p class="font-semibold truncate">${app.name || 'Nama Aplikasi'}</p><p class="text-sm truncate">${app.summary || 'Deskripsi singkat...'}</p></div><a href="${app.link}" target="_blank" class="bg-blue-700 text-white p-2 rounded-full"><i class="fas fa-external-link-alt"></i></a></div>`;
            }).join('');
            fdroidSearchResultArea.innerHTML = `<div class="space-y-3">${resultsHTML}</div>`;
        } catch(error) {
            displayError(fdroidSearchResultArea, error);
        } finally {
            searchFdroidButton.disabled = false;
            searchFdroidButton.innerHTML = 'Cari Aplikasi';
        }
    }
    
    async function fetchTikTokInfo() {
    const tiktokUrlInput = document.getElementById('tiktok-url-input');
    const tiktokResultArea = document.getElementById('tiktok-result-area');
    const fetchTiktokVideoButton = document.getElementById('fetch-tiktok-video-button');
    const tiktokCustomFilenameInput = document.getElementById('tiktok-custom-filename');

    displayLoading(tiktokResultArea, fetchTiktokVideoButton, 'card');
    try {
        const videoUrl = validateInput(tiktokUrlInput, 'tiktok');
        const apiUrl = `https://api.ownblox.my.id/api/ttdl?url=${encodeURIComponent(videoUrl)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === true && data.result) {
            const result = data.result;
            const customNamePart = tiktokCustomFilenameInput.value.trim();
            let finalBaseFilename = customNamePart ? `ByVintex - ${customNamePart}` : (result.title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 50) || 'tiktok_video_download');
            
            tiktokResultArea.innerHTML = `
                <div class="bg-gradient-to-br p-4">
                    <p class="font-semibold mb-2 truncate" title="${result.title}">${result.title}</p>
                    <p class="text-sm mb-4">by: ${result.author}</p>
                    <video class="w-full rounded-lg mb-4" controls src="${result.video}"></video>
                    <div class="flex items-center space-x-2">
                        <div class="flex space-x-2 flex-1">
                            <button data-url="${result.video}" data-filename="${finalBaseFilename}.mp4" class="download-button flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-video mr-2"></i>Video</button>
                            <button data-url="${result.audio}" data-filename="${finalBaseFilename}.mp3" class="download-button flex-1 text-center bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-music mr-2"></i>Audio</button>
                        </div>
                        <button class="add-to-queue-button" data-url="${result.video}" data-filename="${finalBaseFilename}.mp4"><i class="fas fa-plus"></i></button>
                        ${createShareButtonHTML({ featureId: 'tiktok-vintex', url: videoUrl, title: result.title })}
                    </div>
                </div>`;
        } else {
            throw new Error(data.message || 'Gagal mengambil data video.');
        }
    } catch (error) {
        displayError(document.getElementById('tiktok-result-area'), error);
    } finally {
        fetchTiktokVideoButton.disabled = false;
        fetchTiktokVideoButton.textContent = 'Download';
    }
}

    async function fetchYouTubeMedia(type, buttonElement) {
        displayLoading(youtubeResultArea, buttonElement, 'card');
        try {
            const videoUrl = validateInput(youtubeUrlInput, 'youtube');
            document.querySelectorAll('.get-media-button').forEach(btn => btn.disabled = true);
            const apiUrl = `https://api.ownblox.my.id/api/ytdl?url=${encodeURIComponent(videoUrl)}&type=${type}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === true && data.result) {
                const result = data.result;
                const downloadUrl = (type === 'mp4') ? result.video_download : result.audio_download;
                if (!downloadUrl) throw new Error(`Link download untuk tipe '${type}' tidak ditemukan.`);
                const customNamePart = youtubeCustomFilenameInput.value.trim();
                let finalBaseFilename = customNamePart ? `ByVintex - ${customNamePart}` : (result.title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 50) || `youtube_media_${type}`);
                youtubeResultArea.innerHTML = `<div class="bg-gradient-to-br p-4"><p class="font-semibold mb-2 truncate" title="${result.title}">${result.title}</p><img src="${result.thumbnail}" alt="Thumbnail" class="w-full rounded-lg mb-4"><p class="text-sm mb-1">Kualitas: ${result.quality || 'Audio'}</p><div class="flex items-center space-x-2"><button data-url="${downloadUrl}" data-filename="${finalBaseFilename}.${type}" class="download-button-yt flex-1 mt-2 text-center bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download File (.${type})</button><button class="add-to-queue-button" data-url="${downloadUrl}" data-filename="${finalBaseFilename}.${type}"><i class="fas fa-plus"></i></button>${createShareButtonHTML({url: downloadUrl, title: result.title})}</div></div>`;
            } else {
                throw new Error(data.message || `Gagal mengambil data YouTube untuk tipe ${type}.`);
            }
        } catch (error) {
            displayError(youtubeResultArea, error);
        } finally {
            document.querySelectorAll('.get-media-button').forEach(btn => {
                btn.disabled = false;
                if(btn.dataset.type === 'mp4') btn.innerHTML = 'Get Video (MP4)'; else btn.innerHTML = 'Get Audio (MP3)';
            });
        }
    }
    
    async function fetchInstagramMedia() {
        displayLoading(instagramResultArea, fetchInstagramMediaButton, 'card');
        try {
            const postUrl = validateInput(instagramUrlInput, 'instagram');
            const apiUrl = `https://api.ownblox.my.id/api/igdl?url=${encodeURIComponent(postUrl)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === true && data.result) {
                const downloadItems = Array.isArray(data.result) ? data.result : [data.result];
                let resultHTML = downloadItems.map((item, index) => {
                    const downloadUrl = item.download_url || item.url;
                    if (!downloadUrl) return '';
                    const fileType = item.type === 'mp4' ? 'mp4' : 'jpg';
                    const customNamePart = instagramCustomFilenameInput.value.trim();
                    let finalBaseFilename = customNamePart ? `ByVintex - ${customNamePart}` : ((item.caption || `instagram_${Date.now()}`).replace(/[<>:"/\\|?*]/g, '_').substring(0, 50));
                    if (downloadItems.length > 1) { finalBaseFilename += `_${index + 1}`; }
                    const finalFilename = `${finalBaseFilename}.${fileType}`;
                    const mediaTag = fileType === 'mp4' ? `<video class="w-full rounded-lg mb-4" controls src="${downloadUrl}"></video>` : `<img src="${item.thumbnail || downloadUrl}" alt="Instagram media" class="w-full rounded-lg mb-4">`;
                    return `<div class="bg-gradient-to-br p-4 mb-4"><p class="text-sm mb-2">by: ${item.username || 'Unknown'}</p>${mediaTag}<p class="text-sm mb-4">${item.caption || ''}</p><div class="flex items-center space-x-2"><button data-url="${downloadUrl}" data-filename="${finalFilename}" class="download-button-ig flex-1 mt-2 text-center bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download (.${fileType})</button><button class="add-to-queue-button" data-url="${downloadUrl}" data-filename="${finalFilename}"><i class="fas fa-plus"></i></button>${createShareButtonHTML({url: downloadUrl, title: item.caption || 'Postingan Instagram'})}</div></div>`;
                }).join('');
                instagramResultArea.innerHTML = resultHTML;
            } else {
                throw new Error(data.message || 'Gagal mengambil data dari Instagram.');
            }
        } catch (error) {
            displayError(instagramResultArea, error);
        } finally {
            fetchInstagramMediaButton.disabled = false;
            fetchInstagramMediaButton.textContent = 'Download';
        }
    }

    function displayYouTubeV2Options() {
        try {
            validateInput(youtubeV2UrlInput, 'youtube');
            youtubeV2ResultArea.innerHTML = '';
            const formats = [{ label: 'Audio (MP3)', value: 'mp3', icon: 'fa-music', color: 'bg-green-600' }, { label: '144p', value: '144', icon: 'fa-video', color: 'bg-gray-600' }, { label: '360p', value: '360', icon: 'fa-video', color: 'bg-blue-600' }, { label: '480p', value: '480', icon: 'fa-video', color: 'bg-blue-600' }, { label: '720p HD', value: '720', icon: 'fa-video', color: 'bg-red-600' }, { label: '1080p FHD', value: '1080', icon: 'fa-video', color: 'bg-red-600' }, { label: '1440p 2K', value: '1440', icon: 'fa-video', color: 'bg-purple-600' }, { label: '2160p 4K', value: '4k', icon: 'fa-video', color: 'bg-purple-600' }, ];
            let optionsHTML = formats.map(format => `<button data-format="${format.value}" class="format-button-yt-v2 w-full text-white font-bold py-2 px-4 rounded-lg ${format.color}"><i class="fas ${format.icon} mr-2"></i>${format.label}</button>`).join('');
            youtubeV2OptionsArea.innerHTML = `<p class="text-center mb-3">Silakan pilih format yang diinginkan:</p><div class="grid grid-cols-2 md:grid-cols-4 gap-3">${optionsHTML}</div>`;
        } catch (error) {
            displayError(youtubeV2OptionsArea, error);
        }
    }

    async function fetchYouTubeMediaV2(format, buttonElement) {
        displayLoading(youtubeV2ResultArea, buttonElement, 'card');
        try {
            const videoUrl = validateInput(youtubeV2UrlInput, 'youtube');
            document.querySelectorAll('.format-button-yt-v2').forEach(btn => btn.disabled = true);
            const originalButtonText = buttonElement.innerHTML;
            const response = await fetch(`${API_BASE_URL}/download/savetube?link=${encodeURIComponent(videoUrl)}&format=${format}`);
            const data = await response.json();
            if (data.status === true && data.result && data.result.download) {
                const result = data.result;
                const customNamePart = youtubeV2CustomFilenameInput.value.trim();
                const fileExtension = format === 'mp3' ? 'mp3' : 'mp4';
                let finalBaseFilename = customNamePart ? `ByVintex - ${customNamePart}` : (result.title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 50) || `youtube_media_${format}`);
                youtubeV2ResultArea.innerHTML = `<div class="bg-gradient-to-br p-4"><p class="font-semibold mb-2 truncate" title="${result.title}">${result.title}</p><img src="${result.thumbnail}" alt="Thumbnail" class="w-full rounded-lg mb-4"><p class="text-sm mb-1">Kualitas Terpilih: ${result.quality || format}</p><div class="flex items-center space-x-2"><button data-url="${result.download}" data-filename="${finalBaseFilename}.${fileExtension}" class="download-button-yt-v2 flex-1 mt-2 text-center bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download File (.${fileExtension})</button><button class="add-to-queue-button" data-url="${result.download}" data-filename="${finalBaseFilename}.${fileExtension}"><i class="fas fa-plus"></i></button>${createShareButtonHTML({url: result.download, title: result.title})}</div></div>`;
            } else {
                throw new Error(data.message || `Gagal mengambil data untuk format ${format}. Mungkin format ini tidak tersedia.`);
            }
        } catch (error) {
            displayError(youtubeV2ResultArea, error);
        } finally {
            document.querySelectorAll('.format-button-yt-v2').forEach(btn => {
                btn.disabled = false;
                if(btn === buttonElement) btn.innerHTML = originalButtonText;
            });
        }
    }

    async function fetchSsweb() {
        displayLoading(sswebResultArea, fetchSswebButton, 'card');
        try {
            const url = validateInput(sswebUrlInput, 'url');
            const response = await fetch(`${API_BASE_URL}/tools/ssweb?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            if (data.status === true && data.result) {
                const { pc: pcImgUrl, mobile: mobileImgUrl } = data.result;
                const baseFilename = (new URL(url).hostname).replace(/[<>:"/\\|?*]/g, '_').substring(0, 40);
                sswebResultArea.innerHTML = `<div class="bg-gradient-to-br p-4 mb-4"><h3 class="font-semibold mb-2">Screenshot PC</h3><img src="${pcImgUrl}" alt="PC Screenshot" class="w-full rounded-lg mb-4 border"><div class="flex items-center space-x-2"><button data-url="${pcImgUrl}" data-filename="${baseFilename}_PC.jpg" class="dl-image-button flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download PC</button>${createShareButtonHTML({url: pcImgUrl, title: `Screenshot PC dari ${url}`})}</div></div><div class="bg-gradient-to-br p-4"><h3 class="font-semibold mb-2">Screenshot Mobile</h3><img src="${mobileImgUrl}" alt="Mobile Screenshot" class="w-full rounded-lg mb-4 border"><div class="flex items-center space-x-2"><button data-url="${mobileImgUrl}" data-filename="${baseFilename}_Mobile.jpg" class="dl-image-button flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download Mobile</button>${createShareButtonHTML({url: mobileImgUrl, title: `Screenshot Mobile dari ${url}`})}</div></div>`;
            } else {
                throw new Error(data.message || 'Gagal mengambil screenshot website.');
            }
        } catch (error) {
            displayError(sswebResultArea, error);
        } finally {
            fetchSswebButton.disabled = false;
            fetchSswebButton.textContent = 'Ambil Screenshot';
        }
    }

    async function fetchHostInfo() {
        displayLoading(hostinfoResultArea, fetchHostinfoButton, 'card');
        try {
            const host = validateInput(hostinfoUrlInput);
            hostinfoResultArea.classList.remove('hidden');
            const response = await fetch(`${API_BASE_URL}/tools/hostinfo?host=${encodeURIComponent(host)}`);
            const data = await response.json();
            if (data.status === true && data.result) {
                const result = data.result;
                let resultHTML = `<p class="mb-2"><strong>IP:</strong> ${result.ip||'-'}</p><p class="mb-2"><strong>Nama Host:</strong> ${result.name||'-'}</p><p class="mb-2"><strong>ISP:</strong> ${result.isp||'-'}</p><p class="mb-2"><strong>Organisasi:</strong> ${result.organisation||'-'}</p><p class="mb-2"><strong>Wilayah:</strong> ${result.region||'-'}</p><p class="mb-2"><strong>Kota:</strong> ${result.city||'-'}</p><p class="mb-2"><strong>Zona Waktu:</strong> ${result.timezone||'-'}</p><p class="mb-2"><strong>Kode Pos:</strong> ${result.postalcode||'-'}</p>`;
                if (result.range && result.range.trim().length > 0) resultHTML += `<p class="mb-2"><strong>Rentang IP:</strong> <pre class="whitespace-pre-wrap">${result.range.trim()}</pre></p>`;
                hostinfoResultArea.innerHTML = resultHTML;
            } else {
                throw new Error(data.message || 'Gagal mendapatkan info host.');
            }
        } catch (error) {
            displayError(hostinfoResultArea, error);
        } finally {
            fetchHostinfoButton.disabled = false;
            fetchHostinfoButton.textContent = 'Dapatkan Info Host';
        }
    }

    async function fetchToGhibli() {
        displayLoading(toghibliResultArea, fetchToghibliButton, 'card');
        try {
            const imageUrl = validateInput(toghibliUrlInput, 'url');
            const prompt = toghibliPromptInput.value.trim();
            let apiUrl = `${API_BASE_URL}/tools/toghibli?url=${encodeURIComponent(imageUrl)}`;
            if (prompt) apiUrl += `&prompt=${encodeURIComponent(prompt)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === true && data.result && data.result.data && data.result.data.length > 0) {
                const ghibliImgUrl = data.result.data[0].url;
                toghibliResultArea.innerHTML = `<div class="bg-gradient-to-br p-4"><img src="${ghibliImgUrl}" alt="Ghibli Style Image" class="w-full rounded-lg mb-4 border"><div class="flex items-center space-x-2"><button data-url="${ghibliImgUrl}" data-filename="ghibli_style_${Date.now()}.png" class="dl-image-button flex-1 text-center bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download</button>${createShareButtonHTML({url: ghibliImgUrl, title: 'Gambar Gaya Ghibli'})}</div></div>`;
            } else {
                throw new Error(data.message || 'Gagal mengubah gambar.');
            }
        } catch (error) {
            displayError(toghibliResultArea, error);
        } finally {
            fetchToghibliButton.disabled = false;
            fetchToghibliButton.textContent = 'Ubah ke Ghibli';
        }
    }
    async function fetchRemini() {
        displayLoading(reminiResultArea, fetchReminiButton, 'card');
        try {
            const imageUrl = validateInput(reminiUrlInput, 'url');
            const response = await fetch(`${API_BASE_URL}/imagecreator/remini?url=${encodeURIComponent(imageUrl)}`);
            const data = await response.json();
            if (data.status === true && data.result) {
                reminiResultArea.innerHTML = `<div class="bg-gradient-to-br p-4"><img src="${data.result}" alt="Enhanced Image" class="w-full rounded-lg mb-4 border"><div class="flex items-center space-x-2"><button data-url="${data.result}" data-filename="remini_enhanced_${Date.now()}.png" class="dl-image-button flex-1 text-center bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download</button>${createShareButtonHTML({url: data.result, title: 'Gambar Enhanced'})}</div></div>`;
            } else {
                throw new Error(data.message || 'Gagal enhance gambar.');
            }
        } catch (error) {
            displayError(reminiResultArea, error);
        } finally {
            fetchReminiButton.disabled = false;
            fetchReminiButton.textContent = 'Enhance Gambar';
        }
    }
    async function fetchUpscale() {
        displayLoading(upscaleResultArea, fetchUpscaleButton, 'card');
        try {
            const imageUrl = validateInput(upscaleUrlInput, 'url');
            const response = await fetch(`${API_BASE_URL}/imagecreator/upscale?url=${encodeURIComponent(imageUrl)}`);
            const data = await response.json();
            if (data.status === true && data.result) {
                upscaleResultArea.innerHTML = `<div class="bg-gradient-to-br p-4"><img src="${data.result}" alt="Upscaled Image" class="w-full rounded-lg mb-4 border"><div class="flex items-center space-x-2"><button data-url="${data.result}" data-filename="upscaled_image_${Date.now()}.png" class="dl-image-button flex-1 text-center bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download</button>${createShareButtonHTML({url: data.result, title: 'Gambar Upscaled'})}</div></div>`;
            } else {
                throw new Error(data.message || 'Gagal upscale gambar.');
            }
        } catch (error) {
            displayError(upscaleResultArea, error);
        } finally {
            fetchUpscaleButton.disabled = false;
            fetchUpscaleButton.textContent = 'Upscale Gambar';
        }
    }

    async function fetchRandomImage(apiEndpoint, resultArea, buttonElement) {
        const originalButtonText = buttonElement.textContent;
        displayLoading(resultArea, buttonElement, 'card');
        try {
            const response = await fetch(`${API_BASE_URL}/random/${apiEndpoint}`);
            if (!response.ok) throw new Error(`Gagal memuat gambar. Status: ${response.status}`);
            const imageUrl = response.url;
            resultArea.innerHTML = `<div class="bg-gradient-to-br p-4"><img src="${imageUrl}" alt="Random Image" class="w-full rounded-lg mb-4 border object-contain max-h-96"><div class="flex items-center space-x-2"><button data-url="${imageUrl}" data-filename="${apiEndpoint}_${Date.now()}.jpg" class="dl-image-button flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download Gambar</button>${createShareButtonHTML({url: imageUrl, title: `Gambar Random ${apiEndpoint}`})}</div></div>`;
        } catch (error) {
            displayError(resultArea, error);
        } finally {
            buttonElement.disabled = false;
            buttonElement.textContent = originalButtonText;
        }
    }
    const fetchRandomWaifu = () => fetchRandomImage('waifu', randomWaifuResultArea, fetchRandomWaifuButton);
    const fetchRandomNsfw = () => fetchRandomImage('nsfw', randomNsfwResultArea, fetchRandomNsfwButton);
    const fetchRandomPapayang = () => fetchRandomImage('papayang', randomPapayangResultArea, fetchRandomPapayangButton);
    
    backButtons.forEach(button => button.addEventListener('click', showHub));
    
    
    document.getElementById('show-image-studio-page').addEventListener('click', (e) => { 
    e.preventDefault(); 
    showPage(document.getElementById('image-studio-page'));
    setupStudioTabs(); // Panggil fungsi setup tab saat halaman dibuka
});

document.getElementById('show-qrcode-generator-page').addEventListener('click', (e) => {
    e.preventDefault();
    showPage(document.getElementById('qrcode-generator-page'), () => {
        // Logika untuk tab
        const tabButtons = document.querySelectorAll('#qrcode-generator-page .studio-tab-button');
        const tabContents = document.querySelectorAll('#qrcode-generator-page .studio-tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                tabContents.forEach(content => content.classList.add('hidden'));
                const tabId = button.dataset.tab;
                document.getElementById(`tab-content-${tabId}`).classList.remove('hidden');
                // Reset tampilan QR saat ganti tab
                generateQRCode(qrCodeTextInput.value.trim()); 
            });
        });

        // Pasang pendengar di kotak teks dan input file
        qrCodeTextInput.addEventListener('input', () => generateQRCode());
        qrCodeFileInput.addEventListener('change', handleImageToQrUpload);
        
        // Atur tampilan awal
        generateQRCode(); 
    });
});
    
    document.getElementById('remove-bg-file-input').addEventListener('change', handleImageUpload);
    
    document.getElementById('show-tts-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('tts-page')); });
    document.getElementById('show-tiktok-v2-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('tiktok-v2-downloader-page')); });
    document.getElementById('show-instagram-v2-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('instagram-v2-downloader-page')); });
    document.getElementById('show-pinterest-v2-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('pinterest-v2-downloader-page')); });
    document.getElementById('show-snackvideo-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('snackvideo-downloader-page')); });
    document.getElementById('show-youtube-v2-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('youtube-v2-downloader-page')); });
    document.getElementById('show-tiktok-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('tiktok-downloader-page')); });
    document.getElementById('show-youtube-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('youtube-downloader-page')); });
    document.getElementById('show-instagram-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('instagram-downloader-page')); });
    document.getElementById('show-pinterest-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('pinterest-downloader-page')); });
    document.getElementById('show-ssweb-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('ssweb-page')); });
    document.getElementById('show-hostinfo-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('hostinfo-page')); });
    document.getElementById('show-toghibli-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('toghibli-page')); });
    document.getElementById('show-remini-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('remini-page')); });
    document.getElementById('show-upscale-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('upscale-page')); });
    document.getElementById('show-random-waifu-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('random-waifu-page'), fetchRandomWaifu); });
    document.getElementById('show-random-nsfw-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('random-nsfw-page'), fetchRandomNsfw); });
    document.getElementById('show-random-papayang-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('random-papayang-page'), fetchRandomPapayang); });
    document.getElementById('show-facebook-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('facebook-downloader-page')); });
    document.getElementById('show-spotify-downloader-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('spotify-downloader-page')); });
    document.getElementById('show-spotify-search-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('spotify-search-page')); });
    document.getElementById('show-gimage-search-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('gimage-search-page')); });
    document.getElementById('show-playstore-search-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('playstore-search-page')); });
    document.getElementById('show-fdroid-search-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('fdroid-search-page')); });
    
    themeToggleButton.addEventListener('click', () => setTema(!document.documentElement.classList.contains('dark')));
    themeToggleSwitch.addEventListener('change', (e) => setTema(e.target.checked));
    resultsPerPageInput.addEventListener('change', (e) => {
        let newValue = parseInt(e.target.value);
        if (isNaN(newValue) || newValue < 3) newValue = 3;
        if (newValue > 50) newValue = 50;
        e.target.value = newValue;
        RESULTS_PER_PAGE = newValue;
        localStorage.setItem('resultsPerPage', newValue);
        showToast(`Hasil per halaman diubah menjadi ${newValue}`, 'info');
    });
    clearApiCacheButton.addEventListener('click', clearApiCache);
    clearHistorySettingsButton.addEventListener('click', () => { if (confirm('Yakin ingin hapus riwayat?')) { 
    localStorage.removeItem('downloadHistory'); 
    showToast('Riwayat unduhan telah dibersihkan.', 'info');
} });
    showSettingsButton.addEventListener('click', (e) => { e.preventDefault(); showPage(settingsPage, loadSettings); });
    showQueueButton.addEventListener('click', (e) => { e.preventDefault(); showPage(queuePage, renderQueue); });
    showHistoryButton.addEventListener('click', (e) => { e.preventDefault(); showPage(historyPage, loadHistory); });
    clearHistoryButton.addEventListener('click', () => { if (confirm('Yakin ingin hapus riwayat?')) { localStorage.removeItem('downloadHistory'); loadHistory(); } });
    copyHostinfoButton.addEventListener('click', async () => {
    const resultText = hostinfoResultArea.innerText;

    if (!resultText || hostinfoResultArea.querySelector('.error-box')) {
        showErrorModal('Tidak Ada Info', 'Tidak ada teks yang bisa disalin.');
        return;
    }

    try {
        await navigator.clipboard.writeText(resultText);
        showToast('Info Host berhasil disalin!', 'success');
    } catch (err) {
        displayError(null, new Error('Gagal menyalin ke clipboard. Browser Anda mungkin tidak mendukung fitur ini.'));
    }
});

// GANTI BLOK INI SELURUHNYA
document.getElementById('show-converter-suite-page').addEventListener('click', (e) => {
    e.preventDefault();
    showPage(document.getElementById('converter-suite-page'), () => {
        // Logika untuk tab di dalam Suite Konverter
        const suitePage = document.getElementById('converter-suite-page');
        const tabButtons = suitePage.querySelectorAll('.studio-tab-button');
        const tabContents = suitePage.querySelectorAll('.studio-tab-content');
        
        // Logika untuk mengaktifkan tab
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                tabContents.forEach(content => content.classList.add('hidden'));
                const tabId = button.dataset.tab;
                document.getElementById(`tab-content-${tabId}`).classList.remove('hidden');
            });
        });

        // --- INI BAGIAN PENTING YANG BARU ---
        // Saat halaman konverter dibuka, coba muat FFmpeg
        const audioInput = document.getElementById('audio-converter-input');
        const audioSelect = document.getElementById('audio-format-select');
        const audioResultArea = document.getElementById('audio-converter-result-area');

        if (!isFFmpegLoaded) {
            audioResultArea.innerHTML = `<div class="text-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"></div><p class="mt-2">Menyiapkan alat konverter audio... (pertama kali agak lama)</p></div>`;
            audioInput.disabled = true;
            audioSelect.disabled = true;

            loadFFmpegScripts()
                .then(() => {
                    audioResultArea.innerHTML = `<p class="text-center text-green-500 font-semibold">Alat konverter siap! Silakan pilih file audio.</p>`;
                    audioInput.disabled = false;
                    audioSelect.disabled = false;
                })
                .catch(() => {
                    displayError(audioResultArea, new Error("Gagal memuat pustaka FFmpeg. Coba periksa koneksi atau matikan Ad-Blocker."));
                });
        }
    });
});



document.getElementById('show-text-generator-page').addEventListener('click', (e) => {
    e.preventDefault();
    showPage(document.getElementById('text-generator-page'), renderFancyText);
});

textGeneratorInput.addEventListener('input', renderFancyText);

// Tambahkan logika 'copy' ke event listener utama
document.body.addEventListener('click', function(e) {
    const copyBtn = e.target.closest('.copy-style-btn');
    if (copyBtn) {
        navigator.clipboard.writeText(copyBtn.dataset.textToCopy).then(() => {
            showToast('Teks berhasil disalin!', 'success');
        });
    }
});


// Pasang pendengar ke input file dan select format
imageConverterInput.addEventListener('change', handleImageConversion);
imageFormatSelect.addEventListener('change', handleImageConversion);

document.getElementById('show-ig-profile-viewer-page').addEventListener('click', (e) => {
    e.preventDefault();
    showPage(document.getElementById('ig-profile-viewer-page'));
});

document.getElementById('show-web-to-pdf-page').addEventListener('click', (e) => { 
    e.preventDefault(); 
    showPage(document.getElementById('web-to-pdf-page')); 
});

audioConverterInput.addEventListener('change', handleAudioConversion);
audioFormatSelect.addEventListener('change', () => {
    // Hanya jalankan jika sudah ada file yang dipilih
    if (audioConverterInput.files.length > 0) {
        handleAudioConversion();
    }
});

document.getElementById('show-api-status-page').addEventListener('click', (e) => {
        e.preventDefault();
        showPage(apiStatusPage, () => {
            renderApiStatusPage(); // Tampilkan data yang sudah ada
            checkApiStatus(false); // Mulai pengecekan baru
        });
    });

    refreshApiStatusButton.addEventListener('click', () => checkApiStatus(false));

document.getElementById('show-admin-download').addEventListener('click', (e) => {
    e.preventDefault();
    const password = prompt("Fitur Khusus Admin. Masukkan Password:");
    if (password === "114477") {
        showPage(document.getElementById('admin-downloader-page'));
    } else if (password !== null) {
        alert("Password salah!");
    }
});
fetchAdminDownloadButton.addEventListener('click', fetchAdminDownload);
startQueueButton.addEventListener('click', processQueue);
clearCompletedButton.addEventListener('click', () => {
    downloadQueue = downloadQueue.filter(item => item.status === 'pending' || item.status === 'downloading');
    saveQueue();
    renderQueue();
    showToast('Item yang selesai/gagal telah dibersihkan.', 'info');
});
document.getElementById('show-admin-feature').addEventListener('click', (e) => {
    e.preventDefault();
    const password = prompt("Fitur Khusus Admin. Masukkan Password:");
    if (password === "114477") {
        showPage(document.getElementById('admin-search-page'));
    } else if (password !== null) {
        alert("Password salah!");
    }
});
searchAdminButton.addEventListener('click', searchAdminContent);
document.getElementById('admin-load-more-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('load-more-button')) {
        adminCurrentPage++;
        displayAdminResults();
    }
});

document.getElementById('show-openai-chat-page').addEventListener('click', (e) => {
    e.preventDefault();
    showPage(document.getElementById('openai-chat-page'));
});
document.getElementById('show-multimodel-chat-page').addEventListener('click', (e) => {
    e.preventDefault();
    showPage(document.getElementById('multimodel-chat-page'));
});

fetchOpenAiButton.addEventListener('click', fetchOpenAiChat);
fetchMultiModelButton.addEventListener('click', fetchMultiModelChat);

    document.getElementById('spotify-load-more-container').addEventListener('click', (e) => { if (e.target.classList.contains('load-more-button')) { spotifyCurrentPage++; displaySpotifyResults(); }});
    document.getElementById('gimage-load-more-container').addEventListener('click', (e) => { if (e.target.classList.contains('load-more-button')) { gimageCurrentPage++; displayGimageResults(); }});
    document.getElementById('pinterest-load-more-container').addEventListener('click', (e) => { if (e.target.classList.contains('load-more-button')) { pinterestCurrentPage++; displayPinterestResults(); }});
    
    document.body.addEventListener('click', (e) => {
        const target = e.target;
        const button = target.closest('button');
        if (!button) return;

        const buttonId = button.id;
        const actions = {
            'fetch-tts-button': fetchTTS,
            'fetch-tiktok-v2-button': fetchTikTokInfoV2,
            'fetch-instagram-v2-button': fetchInstagramMediaV2,
            'fetch-pinterest-v2-button': fetchPinterestMediaV2,
            'fetch-snackvideo-button': fetchSnackVideo,
            'fetch-facebook-button': fetchFacebookMedia,
            'fetch-spotify-button': fetchSpotifySong,
            'search-spotify-button': searchSpotify,
            'search-gimage-button': searchGoogleImages,
            'search-playstore-button': searchPlayStore,
            'search-fdroid-button': searchFDroid,
            'fetch-ig-profile-pic-button': fetchInstagramProfilePic,
            'fetch-tiktok-video-button': fetchTikTokInfo,
            'fetch-youtube-mp4-button': () => fetchYouTubeMedia('mp4', fetchYoutubeMp4Button),
            'fetch-youtube-mp3-button': () => fetchYouTubeMedia('mp3', fetchYoutubeMp3Button),
            'fetch-instagram-media-button': fetchInstagramMedia,
            'fetch-pinterest-media-button': fetchPinterestMedia,
            'fetch-youtube-v2-options-button': displayYouTubeV2Options,
            'fetch-ssweb-button': fetchSsweb,
            'fetch-hostinfo-button': fetchHostInfo,
            'fetch-toghibli-button': fetchToGhibli,
            'fetch-remini-button': fetchRemini,
            'fetch-upscale-button': fetchUpscale,
            'fetch-random-waifu-button': fetchRandomWaifu,
            'fetch-random-nsfw-button': fetchRandomNsfw,
            'fetch-random-papayang-button': fetchRandomPapayang,
            'fetch-web-to-pdf-button': fetchWebToPdf,
            'process-remove-bg-button': processRemoveBg
        };

        if (buttonId && actions[buttonId]) {
            actions[buttonId]();
        }

        if (target.closest('.add-to-queue-button')) {
            const btn = target.closest('.add-to-queue-button');
            addToQueue({ url: btn.dataset.url, filename: btn.dataset.filename });
            return;
        }
        
        const adminProcessBtn = target.closest('.admin-process-link-btn');
if (adminProcessBtn) {
    const urlToProcess = adminProcessBtn.dataset.url;
    // Buka halaman admin downloader dan langsung isi URL-nya
    showPage(document.getElementById('admin-downloader-page'));
    adminDownloadUrlInput.value = urlToProcess;
    // Langsung klik tombol proses untuk memulai
    fetchAdminDownloadButton.click(); 
}

const copyQrResultBtn = e.target.closest('.copy-qr-result-btn');
    if (copyQrResultBtn) {
        navigator.clipboard.writeText(copyQrResultBtn.dataset.copyText).then(() => {
            showToast('Hasil pindaian berhasil disalin!', 'success');
        });
        return;
    }

const vnBtn = target.closest('.vn-dl-button');
        if (vnBtn) {
            convertToVN(vnBtn.dataset.url, vnBtn.dataset.filename, vnBtn);
            return; // Penting: Tambahkan 'return' agar kode di bawahnya tidak ikut dijalankan
        }

        const dlBtn = target.closest('.new-dl-button, .dl-image-button, .download-button, .download-button-yt, .download-button-ig, .download-button-pin, .download-button-yt-v2');
        if (dlBtn) {
            forceDownload(dlBtn.dataset.url, dlBtn.dataset.filename, dlBtn);
        }
        const spotifyDlBtn = target.closest('.spotify-search-dl-btn');
        if (spotifyDlBtn) {
            downloadFromSpotifySearch(spotifyDlBtn.dataset.link, spotifyDlBtn.dataset.filename, spotifyDlBtn);
        }
        const spotifyPlayBtn = target.closest('.spotify-search-play-btn');
        if (spotifyPlayBtn) {
            playFromSpotifySearch(spotifyPlayBtn.dataset.link, spotifyPlayBtn.dataset.title, spotifyPlayBtn);
        }
        const ytV2FormatBtn = target.closest('.format-button-yt-v2');
        if (ytV2FormatBtn) {
            fetchYouTubeMediaV2(ytV2FormatBtn.dataset.format, ytV2FormatBtn);
        }
        const shareBtn = target.closest('.share-button');
        if (shareBtn) {
            const { url, title, text } = shareBtn.dataset;
            if (navigator.share) {
                navigator.share({
                    title: title || document.title,
                    text: text || '',
                    url: url || window.location.href,
                }).catch((error) => console.log('Gagal berbagi:', error));
            }
        }
    });

setupInputPersistence(ttsTextInput, 'saved_tts_input');
setupInputPersistence(tiktokV2UrlInput, 'saved_tiktok_v2_url');
setupInputPersistence(instagramV2UrlInput, 'saved_ig_v2_url');
setupInputPersistence(pinterestV2UrlInput, 'saved_pinterest_v2_url');
setupInputPersistence(snackvideoUrlInput, 'saved_snack_url');
setupInputPersistence(facebookUrlInput, 'saved_facebook_url');
setupInputPersistence(spotifyUrlInput, 'saved_spotify_dl_url');
setupInputPersistence(spotifySearchQuery, 'saved_spotify_search_query');
setupInputPersistence(gimageSearchQuery, 'saved_gimage_search_query');
setupInputPersistence(playstoreSearchQuery, 'saved_playstore_search_query');
setupInputPersistence(fdroidSearchQuery, 'saved_fdroid_search_query');
setupInputPersistence(adminSearchQuery, 'saved_admin_search_query');
setupInputPersistence(adminDownloadUrlInput, 'saved_admin_download_url');

    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalButton = document.getElementById('close-modal-button');
    const modalWidget = document.getElementById('modal-widget');
    
    if (modalOverlay && closeModalButton && modalWidget) {
        const closeModal = () => {
            modalOverlay.style.opacity = '0';
            modalWidget.style.transform = 'scale(0.95)';
            setTimeout(() => modalOverlay.classList.add('hidden'), 300);
        };
        closeModalButton.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
        modalOverlay.classList.remove('hidden');
        setTimeout(() => {
            modalOverlay.style.opacity = '1';
            modalWidget.style.transform = 'scale(1)';
        }, 50);
    }
    
    setTema(localStorage.getItem('theme') === 'dark');
    console.log("Menjalankan pengecekan status API awal...");
    checkApiStatus(true); // Jalankan pertama kali saat halaman dimuat

    // Atur agar pengecekan berjalan lagi setiap 5 menit (300000 milidetik)
    setInterval(checkApiStatus, 300000);
    handleSharedUrl();
});