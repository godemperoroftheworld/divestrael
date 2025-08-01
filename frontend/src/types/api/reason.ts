enum BoycottReason {
  CONSTRUCTION_OCCUPIED_LAND = 'CONSTRUCTION_OCCUPIED_LAND',
  SETTLEMENT_PRODUCTION = 'SETTLEMENT_PRODUCTION',
  EXPLOITATION_OCCUPIED_PRODUCTION_RESOURCES = 'EXPLOITATION_OCCUPIED_PRODUCTION_RESOURCES',
  SERVICES_SETTLEMENTS = 'SERVICES_SETTLEMENTS',
  PRIVATE_SECURITY_SURVEILLANCE_TECHNOLOGY = 'PRIVATE_SECURITY_SURVEILLANCE_TECHNOLOGY',
  SPECIALIZED_EQUIPMENT_SERVICES = 'SPECIALIZED_EQUIPMENT_SERVICES',
  WALL_CHECKPOINTS = 'WALL_CHECKPOINTS',
  PALESTINIAN_CAPTIVE_MARKET = 'PALESTINIAN_CAPTIVE_MARKET',
  ECONOMIC_EXPLOITATION = 'ECONOMIC_EXPLOITATION',
  POPULATION_CONTROL = 'POPULATION_CONTROL',
  SETTLEMENT_ENTERPRISE = 'SETTLEMENT_ENTERPRISE',
  MILITARY_EQUIPMENT = 'MILITARY_EQUIPMENT',
  EXPLOITATION_LABOUR = 'EXPLOITATION_LABOUR',
  ENVIRONMENTAL_DAMAGE = 'ENVIRONMENTAL_DAMAGE',
  DEMOLITION_EQUIPMENT = 'DEMOLITION_EQUIPMENT',
}

export const BoycottMapping: Record<BoycottReason, string> = {
  CONSTRUCTION_OCCUPIED_LAND: 'Construction on Occupied Land',
  SETTLEMENT_PRODUCTION: 'Settlement Production',
  EXPLOITATION_OCCUPIED_PRODUCTION_RESOURCES:
    'Exploitation of Occupied Production Resources',
  SERVICES_SETTLEMENTS: 'Settlement Services',
  PRIVATE_SECURITY_SURVEILLANCE_TECHNOLOGY:
    'Private Security and Surveillance Technology',
  SPECIALIZED_EQUIPMENT_SERVICES: 'Specialized Equipment Services',
  WALL_CHECKPOINTS: 'Wall Checkpoints',
  PALESTINIAN_CAPTIVE_MARKET: 'Palestinian Captive Market',
  ECONOMIC_EXPLOITATION: 'Economic Exploitation',
  POPULATION_CONTROL: 'Population Control',
  SETTLEMENT_ENTERPRISE: 'Settlement Enterprise',
  MILITARY_EQUIPMENT: 'Military Equipment',
  EXPLOITATION_LABOUR: 'Exploitation of Labour',
  ENVIRONMENTAL_DAMAGE: 'Environmental Damage',
  DEMOLITION_EQUIPMENT: 'Demolition Equipment',
};

export default BoycottReason;
