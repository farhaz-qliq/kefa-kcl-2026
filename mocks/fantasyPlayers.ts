import type { FantasyPlayer } from "@/types/fantasy";

// 6 players per team (1 GK · 2 DEF · 2 MID · 1 FWD) × 16 teams = 96 players
// Prices in AED millions out of 100M budget
// Kerala / UAE names throughout

const RAW: [string, string, string, FantasyPlayer["position"], number, number, number, number, number, number, number][] = [
  // id         name                  teamId  pos    price  pts  form  sel%   G   A  CS
  // ── Group A · t1 FAVF ──
  ["fp1",  "Shanif K",            "t1", "GK",   5.0,  44, 5.8,  9.2,  0,  2,  4],
  ["fp2",  "Anzil Mohammed",      "t1", "DEF",  6.0,  58, 7.5, 18.1,  2,  3,  4],
  ["fp3",  "Amjad Rajan",         "t1", "DEF",  5.5,  47, 6.1, 11.4,  1,  2,  4],
  ["fp4",  "Jipsen Joy",          "t1", "MID", 10.5,  89, 11.4, 43.2, 7,  6,  1],
  ["fp5",  "Noufal K",            "t1", "MID",  7.5,  63, 8.2, 24.5,  4,  5,  1],
  ["fp6",  "Riyas Shibil",        "t1", "FWD",  9.0,  79, 10.1, 35.8, 7,  4,  0],
  // ── t2 ABR ──
  ["fp7",  "Anas Bilal",          "t2", "GK",   5.5,  50, 6.4, 11.8,  0,  1,  3],
  ["fp8",  "Surya",               "t2", "DEF",  6.5,  61, 7.8, 20.3,  3,  2,  3],
  ["fp9",  "Safal",               "t2", "DEF",  5.0,  41, 5.3,  8.7,  0,  3,  3],
  ["fp10", "Sinan Nafis",         "t2", "MID",  8.5,  74, 9.5, 28.6,  5,  7,  0],
  ["fp11", "Faisal Minhaj",       "t2", "MID",  7.0,  60, 7.9, 19.2,  4,  4,  0],
  ["fp12", "Jinshad",             "t2", "FWD",  8.5,  71, 9.2, 30.4,  6,  3,  0],
  // ── t3 HIM ──
  ["fp13", "Bilal Asif",          "t3", "GK",   4.5,  38, 4.9,  7.3,  0,  0,  2],
  ["fp14", "Vishnu Arun",         "t3", "DEF",  5.5,  49, 6.3, 12.6,  1,  3,  2],
  ["fp15", "Rahul Jithin",        "t3", "DEF",  5.0,  43, 5.6,  9.8,  1,  1,  2],
  ["fp16", "Ajmal Shibil",        "t3", "MID",  7.5,  66, 8.5, 22.8,  5,  4,  0],
  ["fp17", "Anand Deepak",        "t3", "MID",  6.5,  55, 7.1, 16.4,  3,  5,  0],
  ["fp18", "Pranav Abhijith",     "t3", "FWD",  7.5,  62, 8.0, 21.0,  5,  3,  0],
  // ── t4 HGGH ──
  ["fp19", "Rashid Omar",         "t4", "GK",   5.0,  46, 5.9,  9.9,  0,  1,  4],
  ["fp20", "Khalid Yusuf",        "t4", "DEF",  6.0,  54, 6.9, 15.3,  2,  2,  4],
  ["fp21", "Hamdan Rashed",       "t4", "DEF",  5.5,  50, 6.4, 13.1,  1,  3,  4],
  ["fp22", "Zaid Kareem",         "t4", "MID",  8.0,  69, 8.8, 26.0,  4,  6,  1],
  ["fp23", "Saeed Tariq",         "t4", "MID",  7.0,  59, 7.6, 18.6,  3,  4,  1],
  ["fp24", "Sreeraj K",           "t4", "FWD",  8.0,  67, 8.6, 23.5,  6,  2,  0],
  // ── Group B · t5 YAS ──
  ["fp25", "Nihal Aneesh",        "t5", "GK",   5.0,  43, 5.5,  8.8,  0,  2,  3],
  ["fp26", "Sujith Midhun",       "t5", "DEF",  5.5,  48, 6.1, 11.9,  1,  2,  3],
  ["fp27", "Vineeth Subin",       "t5", "DEF",  5.0,  44, 5.7,  9.5,  1,  1,  3],
  ["fp28", "Akhil Sajid",         "t5", "MID",  9.5,  84, 10.8, 38.7, 7,  6,  0],
  ["fp29", "Noufal Faris",        "t5", "MID",  7.5,  64, 8.2, 22.9,  4,  5,  0],
  ["fp30", "Amjad Joy",           "t5", "FWD", 10.0,  91, 11.7, 45.2, 9,  5,  0],
  // ── t6 RMS ──
  ["fp31", "Arun Nithin",         "t6", "GK",   5.5,  51, 6.5, 12.4,  0,  1,  5],
  ["fp32", "Jipsen Riyas",        "t6", "DEF",  6.5,  60, 7.7, 19.8,  2,  4,  5],
  ["fp33", "Shafeer Adnan",       "t6", "DEF",  5.5,  52, 6.6, 14.0,  1,  3,  5],
  ["fp34", "Akhil Deepak",        "t6", "MID",  9.0,  80, 10.2, 36.4, 6,  7,  2],
  ["fp35", "Ibrahim Shibil",      "t6", "MID",  7.5,  65, 8.4, 23.3,  4,  5,  2],
  ["fp36", "Salman Hussain",      "t6", "FWD",  9.5,  86, 11.0, 40.5, 8,  5,  0],
  // ── t7 LGA ──
  ["fp37", "Hassan Abdul",        "t7", "GK",   4.5,  40, 5.1,  8.0,  0,  0,  2],
  ["fp38", "Muhammed Rashid",     "t7", "DEF",  5.5,  47, 6.0, 11.2,  1,  2,  2],
  ["fp39", "Anzil Sinan",         "t7", "DEF",  5.0,  42, 5.4,  9.0,  0,  2,  2],
  ["fp40", "Shanif Nafis",        "t7", "MID",  7.0,  61, 7.8, 20.1,  4,  4,  0],
  ["fp41", "Bilal Faisal",        "t7", "MID",  6.5,  56, 7.2, 17.4,  3,  4,  0],
  ["fp42", "Arjun Vishnu",        "t7", "FWD",  8.0,  69, 8.8, 24.7,  6,  3,  0],
  // ── t8 KEY ──
  ["fp43", "Asif Bilal",          "t8", "GK",   5.0,  45, 5.7, 10.1,  0,  1,  3],
  ["fp44", "Omar Khalid",         "t8", "DEF",  6.0,  55, 7.0, 16.0,  2,  3,  3],
  ["fp45", "Yusuf Hamdan",        "t8", "DEF",  5.5,  50, 6.4, 13.5,  1,  2,  3],
  ["fp46", "Kareem Zaid",         "t8", "MID",  8.5,  75, 9.6, 29.3,  5,  6,  1],
  ["fp47", "Rashed Saeed",        "t8", "MID",  7.0,  62, 7.9, 21.5,  4,  4,  1],
  ["fp48", "Tariq Anand",         "t8", "FWD",  9.0,  78, 10.0, 33.8, 7,  4,  0],
  // ── Group C · t9 RIV ──
  ["fp49", "Sajid Asif",          "t9", "GK",   4.5,  39, 5.0,  7.8,  0,  1,  2],
  ["fp50", "Jithin Rahul",        "t9", "DEF",  5.5,  48, 6.1, 12.0,  1,  2,  2],
  ["fp51", "Amal Riyad",          "t9", "DEF",  5.0,  43, 5.5,  9.7,  1,  1,  2],
  ["fp52", "Shibil Ajmal",        "t9", "MID",  8.0,  70, 8.9, 25.8,  5,  5,  0],
  ["fp53", "Abhijith Pranav",     "t9", "MID",  7.0,  59, 7.6, 18.8,  3,  5,  0],
  ["fp54", "Noufal Shibil",       "t9", "FWD",  8.5,  74, 9.4, 31.2,  7,  3,  0],
  // ── t10 THA ──
  ["fp55", "Subin Vineeth",       "t10", "GK",   5.0,  44, 5.6,  9.4,  0,  0,  3],
  ["fp56", "Midhun Sujith",       "t10", "DEF",  5.5,  49, 6.3, 12.8,  1,  3,  3],
  ["fp57", "Aneesh Nihal",        "t10", "DEF",  5.0,  45, 5.7, 10.2,  1,  2,  3],
  ["fp58", "Arun Vishnu",         "t10", "MID",  7.5,  64, 8.2, 22.6,  4,  5,  1],
  ["fp59", "Jipsen Arjun",        "t10", "MID",  7.0,  58, 7.5, 17.9,  3,  4,  1],
  ["fp60", "Deepak Anand",        "t10", "FWD",  8.0,  68, 8.7, 24.0,  6,  3,  0],
  // ── t11 YBID ──
  ["fp61", "Rashid Khalid",       "t11", "GK",   5.0,  46, 5.9, 10.4,  0,  1,  3],
  ["fp62", "Faisal Omar",         "t11", "DEF",  6.0,  53, 6.8, 14.8,  2,  2,  3],
  ["fp63", "Minhaj Sinan",        "t11", "DEF",  5.5,  48, 6.2, 11.7,  1,  2,  3],
  ["fp64", "Joy Nithin",          "t11", "MID",  9.0,  81, 10.3, 37.2, 6,  7,  0],
  ["fp65", "Amjad Akhil",         "t11", "MID",  7.5,  66, 8.5, 23.7,  4,  5,  0],
  ["fp66", "Ibrahim Hassan",      "t11", "FWD",  9.5,  83, 10.6, 39.0, 8,  4,  0],
  // ── t12 LSS ──
  ["fp67", "Shanif Adnan",        "t12", "GK",   5.5,  52, 6.6, 12.9,  0,  2,  4],
  ["fp68", "Anzil Ajmal",         "t12", "DEF",  6.5,  59, 7.6, 19.3,  2,  3,  4],
  ["fp69", "Noufal Nafis",        "t12", "DEF",  5.5,  51, 6.5, 13.8,  1,  3,  4],
  ["fp70", "Sreeraj Subin",       "t12", "MID",  8.0,  71, 9.0, 26.5,  5,  5,  1],
  ["fp71", "Bilal Asif",          "t12", "MID",  7.0,  60, 7.7, 19.7,  3,  5,  1],
  ["fp72", "Arjun Rahul",         "t12", "FWD",  8.5,  76, 9.7, 32.4,  7,  3,  0],
  // ── Group D · t13 SPU ──
  ["fp73", "Hamdan Tariq",        "t13", "GK",   5.5,  53, 6.8, 13.5,  0,  2,  5],
  ["fp74", "Rashed Yusuf",        "t13", "DEF",  7.0,  64, 8.2, 22.1,  3,  4,  5],
  ["fp75", "Kareem Zaid",         "t13", "DEF",  6.0,  56, 7.1, 16.9,  2,  3,  5],
  ["fp76", "Salman Abdul",        "t13", "MID", 11.0,  96, 12.3, 51.4, 9,  8,  2],
  ["fp77", "Jipsen Shibil",       "t13", "MID",  8.5,  77, 9.8, 31.8,  5,  7,  2],
  ["fp78", "Amjad Hussain",       "t13", "FWD", 13.0, 112, 14.2, 62.3,12,  6,  0],
  // ── t14 DDP ──
  ["fp79", "Sahal",               "t14", "GK",   5.0,  47, 5.9, 10.8,  0,  1,  3],
  ["fp80", "Hashir",              "t14", "DEF",  6.0,  55, 7.0, 16.3,  2,  2,  3],
  ["fp81", "Haris",               "t14", "DEF",  5.5,  50, 6.4, 13.2,  1,  3,  3],
  ["fp82", "Shammas",             "t14", "MID",  8.0,  72, 9.1, 27.4,  5,  6,  0],
  ["fp83", "Amjad",               "t14", "MID",  7.5,  65, 8.3, 23.0,  4,  5,  0],
  ["fp84", "Shanif",              "t14", "FWD",  9.0,  80, 10.2, 36.0, 8,  3,  0],
  // ── t15 FAM ──
  ["fp85", "Asif Rashid",         "t15", "GK",   5.0,  45, 5.7, 10.2,  0,  1,  3],
  ["fp86", "Omar Ibrahim",        "t15", "DEF",  6.0,  54, 6.9, 15.6,  2,  2,  3],
  ["fp87", "Bilal Sinan",         "t15", "DEF",  5.5,  49, 6.3, 12.5,  1,  2,  3],
  ["fp88", "Joy Amal",            "t15", "MID",  9.5,  86, 11.0, 41.6, 7,  7,  1],
  ["fp89", "Anzil Faris",         "t15", "MID",  7.5,  66, 8.5, 23.8,  4,  5,  1],
  ["fp90", "Shanif Ajmal",        "t15", "FWD", 11.5, 105, 13.4, 58.9,11,  6,  0],
  // ── t16 GTZ ──
  ["fp91", "Vishnu Arun",         "t16", "GK",   5.5,  51, 6.5, 12.1,  0,  1,  4],
  ["fp92", "Jithin Anand",        "t16", "DEF",  6.5,  60, 7.6, 19.0,  2,  3,  4],
  ["fp93", "Deepak Sujith",       "t16", "DEF",  5.5,  52, 6.6, 14.4,  1,  3,  4],
  ["fp94", "Pranav Aneesh",       "t16", "MID",  8.0,  70, 8.9, 25.3,  5,  5,  1],
  ["fp95", "Abhijith Midhun",     "t16", "MID",  7.0,  59, 7.6, 18.4,  3,  4,  1],
  ["fp96", "Andhru",              "t16", "FWD",  9.0,  77, 9.8, 33.1,  7,  4,  0],
];

export const MOCK_FANTASY_PLAYERS: FantasyPlayer[] = RAW.map(
  ([id, name, teamId, position, price, totalPoints, form, selectedBy, goals, assists, cleanSheets]) => ({
    id: id as string,
    name: name as string,
    teamId: teamId as string,
    position: position as FantasyPlayer["position"],
    price: price as number,
    totalPoints: totalPoints as number,
    form: form as number,
    selectedBy: selectedBy as number,
    goals: goals as number,
    assists: assists as number,
    cleanSheets: cleanSheets as number,
  })
);

export const FANTASY_BUDGET = 100; // AED 100M
