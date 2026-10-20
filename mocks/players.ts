import type { Player } from "@/types";

const positions = ["GK", "DEF", "DEF", "MID", "MID", "MID", "FWD", "FWD", "FWD", "DEF"] as const;

const namesByTeam: Record<string, string[]> = {
  t1: ["Ali Hassan", "Omar Farooq", "Khalid Nasser", "Zaid Ahmed", "Samir Qureshi", "Rayan Malik", "Hamza Bilal", "Tariq Saleh", "Faris Jaber", "Nour Idris"],
  t2: ["Mohammed Rashid", "Surya", "Safal", "Sameer Patel", "Arjun Mehta", "Dev Sharma", "Jinshad", "Kannan", "Vivek Singh", "Aakash Nair"],
  t3: ["Carlos Ruiz", "Diego Morales", "Juan Perez", "Luis Hernandez", "Miguel Santos", "Rafael Torres", "Pedro Alves", "Marco Fernandez", "Sergio Lopez", "Bruno Costa"],
  t4: ["James Wilson", "Tom Clarke", "Ryan Hughes", "Mark Davis", "Luke Johnson", "Harry Brown", "Jack Taylor", "Oliver White", "Noah Martin", "Ethan Thompson"],
  t5: ["Yusuf Al-Amri", "Sultan Al-Balushi", "Fahad Al-Rashdi", "Khalil Al-Sinani", "Saif Al-Hosni", "Amer Al-Busaidi", "Hilal Al-Siyabi", "Nasser Al-Farsi", "Majid Al-Abri", "Walid Al-Shidi"],
  t6: ["Kenji Tanaka", "Hiroshi Yamamoto", "Takeshi Ito", "Yuta Nakamura", "Shota Kimura", "Ren Suzuki", "Kenta Watanabe", "Haruki Sato", "Sota Kobayashi", "Ryota Fujita"],
  t7: ["Ahmed Siddiqui", "Hassan Mirza", "Bilal Chaudhry", "Usman Iqbal", "Waseem Akram", "Kamran Baig", "Fawad Akhtar", "Nabeel Hussain", "Imran Zafar", "Sajid Raza"],
  t8: ["Enzo Ricci", "Marco Bianchi", "Luca Romano", "Giorgio Ferrari", "Andrea Russo", "Matteo Conti", "Alessandro Gallo", "Davide Moretti", "Francesco Costa", "Simone Barbieri"],
  t9: ["Kwame Asante", "Kofi Mensah", "Ama Darko", "Yaw Boateng", "Akwasi Owusu", "Fiifi Adjei", "Kojo Ansah", "Nana Opoku", "Kofi Agyei", "Kwesi Baah"],
  t10: ["Park Ji-sung", "Kim Tae-yang", "Lee Jun-ho", "Choi Min-jun", "Jang Hyun-soo", "Oh Seung-hwan", "Hwang In-beom", "Son Heung-il", "Jung Woo-young", "Kwon Chang-hoon"],
  t11: ["Ivan Petrov", "Mikhail Volkov", "Sergei Ivanov", "Andrei Sokolov", "Pavel Kuznetsov", "Dmitri Smirnov", "Nikolai Fedorov", "Alexei Popov", "Victor Novikov", "Roman Kozlov"],
  t12: ["Neymar Silva", "Gabriel Costa", "Thiago Alves", "Lucas Ferreira", "Mateus Souza", "Rafael Rocha", "Vitor Lima", "Filipe Santos", "Ricardo Pereira", "Bruno Carvalho"],
  t13: ["Mohamed Salah Jr", "Amr Mostafa", "Karim Gouda", "Hassan Abdel", "Tarek Mahmoud", "Sherif Lotfy", "Omar Nagib", "Ahmed Reda", "Khaled Monir", "Walid Samy"],
  t14: ["Sahal", "Hashir", "Haris", "Shammas", "Amjad", "Darragh Kelly", "Shanif", "Anzil", "Ifraz", "Shakeeb"],
  t15: ["Zlatan Eriksson", "Erik Karlsson", "Lars Lindqvist", "Johan Bergstrom", "Anders Holmberg", "Mikael Strand", "Peter Johansson", "Nils Abrahamsson", "Gustav Holm", "Henrik Ljung"],
  t16: ["Thierry Dubois", "Nicolas Martin", "Pierre Moreau", "Jean Bernard", "Antoine Rousseau", "Julien Lefevre", "Andhru", "Sebastien Laurent", "Maxime Garnier", "Romain Girard"],
};

export const MOCK_PLAYERS: Player[] = Object.entries(namesByTeam).flatMap(([teamId, names]) =>
  names.map((name, i) => ({
    id: `${teamId}-p${i + 1}`,
    teamId,
    name,
    number: i + 1,
    position: positions[i],
    goals: Math.floor(Math.random() * 8),
    assists: Math.floor(Math.random() * 6),
    yellowCards: Math.floor(Math.random() * 3),
    redCards: Math.random() > 0.9 ? 1 : 0,
    season: "2026" as const,
  }))
);
