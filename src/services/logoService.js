/**
 * Logo Service - Get brand logos dynamically
 * Uses multiple fallback methods to retrieve actual brand logos
 */

// Known brand domains mapping
const BRAND_DOMAINS = {
  // Food & Dining
  'Swiggy': 'swiggy.com',
  'Zomato': 'zomato.com',
  'Dominos': 'dominos.co.in',
  'Mcdonald': 'mcdonalds.com',
  'Kfc': 'kfc.com',
  'Pizzahut': 'pizzahut.co.in',
  'Subway': 'subway.com',
  
  // E-commerce
  'Amazon': 'amazon.in',
  'Flipkart': 'flipkart.com',
  'Meesho': 'meesho.com',
  'Myntra': 'myntra.com',
  'Ajio': 'ajio.com',
  'Shopsy': 'shopsy.in',
  
  // Fashion
  'Snitch': 'snitch.com',
  'Beyoung': 'beyoung.in',
  'Bewakoof': 'bewakoof.com',
  'Urbanic': 'urbanic.com',
  
  // Beauty & Personal Care
  'Nykaa': 'nykaa.com',
  'Purplle': 'purplle.com',
  'Bellavitaorganic': 'bellavitaorganic.com',
  'Aqualogica': 'aqualogica.in',
  'Bombayshavingcompany': 'bombayshavingcompany.com',
  'Mamaearth': 'mamaearth.in',
  
  // Technology
  'Lenovo': 'lenovo.com',
  'Apple': 'apple.com',
  'Samsung': 'samsung.com',
  'Dell': 'dell.com',
  'HP': 'hp.com',
  'Asus': 'asus.com',
  
  // Entertainment
  'Netflix': 'netflix.com',
  'Primevideo': 'primevideo.com',
  'Hotstar': 'hotstar.com',
  'Spotify': 'spotify.com',
  'Youtube': 'youtube.com',
  'Zee5': 'zee5.com',
  
  // Travel & Transport
  'Uber': 'uber.com',
  'Ola': 'olacabs.com',
  'Makemytrip': 'makemytrip.com',
  'Goibibo': 'goibibo.com',
  'Cleartrip': 'cleartrip.com',
  'Irctc': 'irctc.co.in',
  
  // Utilities & Services
  'Airtel': 'airtel.in',
  'Jio': 'jio.com',
  'Vi': 'myvi.in',
  'Paytm': 'paytm.com',
  'Phonepe': 'phonepe.com',
  'Gpay': 'pay.google.com',
  
  // Professional
  'Linkedin': 'linkedin.com',
  'Indeed': 'indeed.com',
  'Naukri': 'naukri.com',
  
  // Logistics
  'Pickrr': 'pickrr.com',
  'Ithinklogistics': 'ithinklogistics.com',
  'Delhivery': 'delhivery.com',
  'Bluedart': 'bluedart.com',
  
  // Groceries
  'Blinkit': 'blinkit.com',
  'Zepto': 'zepto.com',
  'Instamart': 'swiggy.com',
  'Bigbasket': 'bigbasket.com',
  'Dunzo': 'dunzo.com',
  
  // Payment & Finance
  'Cred': 'cred.club',
  'Mobikwik': 'mobikwik.com',
  'Freecharge': 'freecharge.in',
  
  // Misc
  'Bookmyshow': 'bookmyshow.com',
  'Licious': 'licious.in',
  'Freshmenu': 'freshmenu.com',
};

/**
 * Get brand logo using multiple fallback strategies
 * @param {string} brandName - Name of the brand (e.g., "Amazon", "Swiggy")
 * @returns {string} - URL to the brand logo
 */
export const getBrandLogo = (brandName) => {
  console.log('🎨 getBrandLogo called with:', brandName);
  
  if (!brandName || brandName === 'Unknown' || brandName === 'Connection Failed') {
    return `https://ui-avatars.com/api/?name=?&background=gray&color=fff&size=128`;
  }

  // Normalize brand name (remove spaces, lowercase for matching)
  const normalizedName = brandName.replace(/\s+/g, '').toLowerCase();
  
  // Find matching domain (case-insensitive)
  const domain = Object.entries(BRAND_DOMAINS).find(
    ([key]) => key.toLowerCase() === normalizedName
  )?.[1];

  if (domain) {
    // Use Google's high-quality favicon service (free, CORS-friendly, reliable)
    // sz=128 gives us decent quality, sz=256 for even better quality
    const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
    console.log(`✅ Logo URL for ${brandName}:`, logoUrl);
    return logoUrl;
  }

  // Fallback: Guess domain and try
  const guessedDomain = `${brandName.toLowerCase().replace(/\s+/g, '')}.com`;
  const fallbackUrl = `https://www.google.com/s2/favicons?domain=${guessedDomain}&sz=256`;
  console.log(`⚠️ Using guessed domain for ${brandName}:`, fallbackUrl);
  return fallbackUrl;
};

/**
 * Get logo with error handling and fallback
 * Returns an object with src and onError handler
 * @param {string} brandName - Name of the brand
 * @returns {object} - {src, onError}
 */
export const getBrandLogoWithFallback = (brandName) => {
  const primaryLogo = getBrandLogo(brandName);
  
  return {
    src: primaryLogo,
    onError: (e) => {
      // Fallback to generic avatar if logo fails to load
      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brandName)}&background=667eea&color=fff&size=128&bold=true`;
    }
  };
};

/**
 * Preload logo to check if it exists
 * @param {string} url - Logo URL
 * @returns {Promise<boolean>} - Whether logo loaded successfully
 */
export const preloadLogo = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

export default getBrandLogo;
