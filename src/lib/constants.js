import { Sword, Shield, Zap, Cloud, Activity, Users } from 'lucide-react';

export const ROLE_COLORS = {
    'Duelist': '#ff4655',
    'Smoker': '#9146ff',
    'Sentinel': '#00d4aa',
    'Initiator': '#ffd400',
    'Flex': '#ff6b00',
    'Sixth': '#666666'
};

export const ROLES_CONFIG = {
    'Duelist': { label: 'Duelistas', color: 'rose', icon: Sword, description: 'Entry fraggers y creadores de espacio.' },
    'Initiator': { label: 'Iniciadores', color: 'amber', icon: Zap, description: 'Recopilación de información y apoyo.' },
    'Sentinel': { label: 'Centinelas', color: 'emerald', icon: Shield, description: 'Defensa y bloqueo de sitios.' },
    'Smoker': { label: 'Controladores', color: 'violet', icon: Cloud, description: 'Control de visión y territorio.' },
    'Flex': { label: 'Flex', color: 'orange', icon: Activity, description: 'Jugadores versátiles.' },
    'Sixth': { label: 'Sexto Jugador', color: 'slate', icon: Users, description: 'El factor sorpresa estratégico.' }
};

// Mapeo extraído de tu script.js
export const PLAYER_METADATA = {
    'SANTIPATICO': { name: 'Santipatico', clip: 'https://www.dropbox.com/scl/fi/yawar1q0bvzetfy863zul/SantipaticoPremiere.mp4?rlkey=xdddn18g8qnao4c4z3dcycjtj&e=1&st=3nwt7zv4&dl=0' },
    'ALPAX': { name: 'Alpax', clip: 'https://www.twitch.tv/alpax/clip/DifferentPlainSangAMPEnergyCherry-9Lvjlr--XwnH2Qmj' },
    'HUBUC0': { name: 'Hubuco', clip: 'https://www.twitch.tv/hubuc0/clip/DaintyMistyPterodactylTooSpicy-MSn19KLT57ax7XlC' },
    'JESSKIU': { name: 'Jesskiu', clip: 'https://www.twitch.tv/jesskiu/clip/LongJoyousRaccoonRalpherZ-ts35qqVPj-mSPPqk' },
    'PEEREIRA7': { name: 'Peereira', clip: 'https://www.twitch.tv/peereira7/clip/SillySullenWombatTBTacoLeft-kS0gSSVUCjO9ekSd' },
    'N1XERINO': { name: 'Nixerino', clip: 'https://www.twitch.tv/n1xerino/clip/PleasantRespectfulSnakeNerfBlueBlaster-_82fAtBftYPj2ORS' },
    'HORCUS': { name: 'Horcus', clip: 'https://www.twitch.tv/horcus/clip/CoyOpenSamosaTheThing--eo2G67RpJ8ND_3D' },
    'WILLOW': { name: 'Willow', clip: 'https://www.twitch.tv/ntwillow/clip/CoweringHandsomeLEDNotLikeThis-VvrfRwJ6BXi50SCG' },
    'JOSEOV22': { name: 'JoseOV', clip: 'https://www.twitch.tv/joseov22/clip/ViscousBashfulSwordRickroll-2O3by6RaXtwOuN4f' },
    'XGONNN_': { name: 'Xgonnn', clip: 'https://www.twitch.tv/xgonnn_/clip/DirtyBravePelicanCorgiDerp-8FiQWgF1UbLWAxbB' },
    'MANU1080': { name: 'Manu1080', clip: 'https://www.twitch.tv/manu1080/clip/ViscousAthleticDuckWholeWheat-ojw5n3_ylMXoDwdH' },
    'VITYSHOW': { name: 'Vityshow', clip: 'https://www.twitch.tv/vityshow/clip/WittyGiftedSushiRitzMitz-FBNIeet2Nxbt9tz-' },
    'B0RJA': { name: 'Borja', clip: 'https://www.twitch.tv/b0rja/clip/CuteCalmOtterKreygasm--o7FA1ZRh09eDrI6' },
    'SRAMIZZ': { name: 'Sramizz', clip: 'https://www.twitch.tv/sramizz/clip/PricklySpotlessRutabagaFloof-lX8VgC-xM9doGYVb' },
    'SIRMAZA': { name: 'Sirmaza', clip: 'https://www.twitch.tv/sirmaza/clip/CrowdedFancyOstrichYee-EaUiqvsY1SrVuwNe' },
    'BLACKELESPANOLITO': { name: 'Black', clip: 'https://www.twitch.tv/blackelespanolito/clip/AttractiveBlazingTitanPicoMause-NUhL578V9fcUZCNH' },
    'XINESCO': { name: 'Xinesco', clip: 'https://www.twitch.tv/xinesco/clip/ColdbloodedSolidDogeBCouch-5Cko-fQASYK-Z2lj' },
    'HITBOXKING': { name: 'HitboxKing', clip: 'https://www.twitch.tv/hitboxking/clip/PricklyVainPartridgeBrokeBack-7a4Fc7aoOss_xE0Y' },
    'TENIZ_06': { name: 'Teniz', clip: 'https://www.twitch.tv/teniz_06/clip/AbstruseConsiderateChickpeaCoolCat-795N2SrgJ0Rp3U6k' }
};