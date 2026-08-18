// Curated, free-to-use St Mark's Basilica / Venice photos (Unsplash), reused
// across tour cards, combos, blog covers, and section backdrops so the whole
// site shares one consistent photo set. Swap any key for your own licensed
// photos whenever you have them — just replace the ID string.
const PHOTO_IDS = {
  facade: "1628106881749-88bf2fb79103", // Basilica facade glowing at sunrise
  byzantineDetail: "1783261088818-bb5efa83dd5c", // ornate Byzantine facade detail, blue sky
  goldMosaic: "1767725185052-48ad415330b5", // gold mosaic facade / cultural heritage detail
  mosaicCeiling: "1784121188112-fd475e40b74f", // intricate gold mosaic ceiling, church interior
  piazza: "1613808001261-8f302f8aabf6", // St Mark's Square, crowds and pigeons
  dogesPalace: "1551278744-ff43597bf4c2", // Piazza San Marco with the Doge's Palace
  campanile: "1667135318467-002e96365857", // St Mark's Campanile bell tower
  domesAerial: "1766015966407-ef4b46c9e82d", // aerial view of the Basilica's domes over Venice
  goldenHour: "1670280221103-a9c23826ff68", // Venetian rooftops with the Campanile at golden hour
  canal: "1523906921802-b5d2d899e93b", // Venetian canal between palazzi
  rialto: "1523906834658-6e24ef2386f9", // Rialto Bridge over the Grand Canal
  venetianCorner: "1519730870542-6fcb06050e78", // quiet Venetian stone bridge corner
};

export function img(key, width = 800, quality = 75) {
  const id = PHOTO_IDS[key] || PHOTO_IDS.facade;
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=${quality}&auto=format&fit=crop`;
}

export const BLOG_COVER_BY_COLOR = {
  marble: img("mosaicCeiling", 900),
  copper: img("goldMosaic", 900),
  bronze: img("facade", 900),
  slate: img("canal", 900),
};

// Prefer an admin-uploaded cover photo; fall back to the stock photo mapped
// to the post's cover color when no photo has been uploaded.
export function getPostCoverImage(post) {
  if (post?.cover_image) return post.cover_image;
  return BLOG_COVER_BY_COLOR[post?.cover_color] || BLOG_COVER_BY_COLOR.marble;
}
