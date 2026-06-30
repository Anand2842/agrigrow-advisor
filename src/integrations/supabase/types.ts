export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contractor_benchmarks: {
        Row: {
          contractor_id: string
          contractor_location: string | null
          contractor_name: string | null
          fan_pad_quote_per_sqm: number | null
          farmer_satisfaction_rating: number | null
          material_substitution_detail: string | null
          material_substitution_found: string | null
          materials_actually_used: string | null
          materials_mentioned_in_quote: string | null
          nvp_quote_per_sqm: number | null
          states_active: string | null
          structure_types_offered: string | null
        }
        Insert: {
          contractor_id: string
          contractor_location?: string | null
          contractor_name?: string | null
          fan_pad_quote_per_sqm?: number | null
          farmer_satisfaction_rating?: number | null
          material_substitution_detail?: string | null
          material_substitution_found?: string | null
          materials_actually_used?: string | null
          materials_mentioned_in_quote?: string | null
          nvp_quote_per_sqm?: number | null
          states_active?: string | null
          structure_types_offered?: string | null
        }
        Update: {
          contractor_id?: string
          contractor_location?: string | null
          contractor_name?: string | null
          fan_pad_quote_per_sqm?: number | null
          farmer_satisfaction_rating?: number | null
          material_substitution_detail?: string | null
          material_substitution_found?: string | null
          materials_actually_used?: string | null
          materials_mentioned_in_quote?: string | null
          nvp_quote_per_sqm?: number | null
          states_active?: string | null
          structure_types_offered?: string | null
        }
        Relationships: []
      }
      crop_data: {
        Row: {
          crop_category: string | null
          crop_id: string
          crop_name_botanical: string | null
          crop_name_common: string
          crop_sub_category: string | null
          direct_light_required: string | null
          dli_minimum: number | null
          dli_optimal: number | null
          export_potential: string | null
          flowering_temp_range: string | null
          flowering_temp_sensitive: string | null
          germination_temp_max: number | null
          germination_temp_min: number | null
          growth_habit: string | null
          harvest_duration: number | null
          irrigation_method_preferred: string | null
          max_plant_height: number | null
          msp_or_market_rate_mh: number | null
          msp_or_market_rate_mp: number | null
          msp_or_market_rate_up: number | null
          nursery_period: number | null
          off_season_viability: string | null
          photoperiod_sensitivity: string | null
          plant_spacing: number | null
          planting_season_mh: string | null
          planting_season_mp: string | null
          planting_season_up: string | null
          plants_per_100_sqm: number | null
          price_peak_month_mh: string | null
          price_peak_month_mp: string | null
          price_peak_month_up: string | null
          rh_critical_high: number | null
          rh_critical_low: number | null
          rh_optimal_max: number | null
          rh_optimal_min: number | null
          root_depth: number | null
          row_spacing: number | null
          salinity_tolerance_ec: number | null
          shade_tolerance: string | null
          temp_day_critical_max: number | null
          temp_day_optimal_max: number | null
          temp_day_optimal_min: number | null
          temp_day_tolerable_max: number | null
          temp_night_critical_min: number | null
          temp_night_optimal_max: number | null
          temp_night_optimal_min: number | null
          temp_night_tolerable_min: number | null
          total_crop_duration: number | null
          transplanting_to_harvest: number | null
          trellising_required: string | null
          varieties_common: string | null
          water_requirement_per_day: number | null
          water_stress_tolerance: string | null
          yield_improvement_factor: number | null
          yield_open_field_avg: number | null
          yield_protected_avg: number | null
        }
        Insert: {
          crop_category?: string | null
          crop_id: string
          crop_name_botanical?: string | null
          crop_name_common: string
          crop_sub_category?: string | null
          direct_light_required?: string | null
          dli_minimum?: number | null
          dli_optimal?: number | null
          export_potential?: string | null
          flowering_temp_range?: string | null
          flowering_temp_sensitive?: string | null
          germination_temp_max?: number | null
          germination_temp_min?: number | null
          growth_habit?: string | null
          harvest_duration?: number | null
          irrigation_method_preferred?: string | null
          max_plant_height?: number | null
          msp_or_market_rate_mh?: number | null
          msp_or_market_rate_mp?: number | null
          msp_or_market_rate_up?: number | null
          nursery_period?: number | null
          off_season_viability?: string | null
          photoperiod_sensitivity?: string | null
          plant_spacing?: number | null
          planting_season_mh?: string | null
          planting_season_mp?: string | null
          planting_season_up?: string | null
          plants_per_100_sqm?: number | null
          price_peak_month_mh?: string | null
          price_peak_month_mp?: string | null
          price_peak_month_up?: string | null
          rh_critical_high?: number | null
          rh_critical_low?: number | null
          rh_optimal_max?: number | null
          rh_optimal_min?: number | null
          root_depth?: number | null
          row_spacing?: number | null
          salinity_tolerance_ec?: number | null
          shade_tolerance?: string | null
          temp_day_critical_max?: number | null
          temp_day_optimal_max?: number | null
          temp_day_optimal_min?: number | null
          temp_day_tolerable_max?: number | null
          temp_night_critical_min?: number | null
          temp_night_optimal_max?: number | null
          temp_night_optimal_min?: number | null
          temp_night_tolerable_min?: number | null
          total_crop_duration?: number | null
          transplanting_to_harvest?: number | null
          trellising_required?: string | null
          varieties_common?: string | null
          water_requirement_per_day?: number | null
          water_stress_tolerance?: string | null
          yield_improvement_factor?: number | null
          yield_open_field_avg?: number | null
          yield_protected_avg?: number | null
        }
        Update: {
          crop_category?: string | null
          crop_id?: string
          crop_name_botanical?: string | null
          crop_name_common?: string
          crop_sub_category?: string | null
          direct_light_required?: string | null
          dli_minimum?: number | null
          dli_optimal?: number | null
          export_potential?: string | null
          flowering_temp_range?: string | null
          flowering_temp_sensitive?: string | null
          germination_temp_max?: number | null
          germination_temp_min?: number | null
          growth_habit?: string | null
          harvest_duration?: number | null
          irrigation_method_preferred?: string | null
          max_plant_height?: number | null
          msp_or_market_rate_mh?: number | null
          msp_or_market_rate_mp?: number | null
          msp_or_market_rate_up?: number | null
          nursery_period?: number | null
          off_season_viability?: string | null
          photoperiod_sensitivity?: string | null
          plant_spacing?: number | null
          planting_season_mh?: string | null
          planting_season_mp?: string | null
          planting_season_up?: string | null
          plants_per_100_sqm?: number | null
          price_peak_month_mh?: string | null
          price_peak_month_mp?: string | null
          price_peak_month_up?: string | null
          rh_critical_high?: number | null
          rh_critical_low?: number | null
          rh_optimal_max?: number | null
          rh_optimal_min?: number | null
          root_depth?: number | null
          row_spacing?: number | null
          salinity_tolerance_ec?: number | null
          shade_tolerance?: string | null
          temp_day_critical_max?: number | null
          temp_day_optimal_max?: number | null
          temp_day_optimal_min?: number | null
          temp_day_tolerable_max?: number | null
          temp_night_critical_min?: number | null
          temp_night_optimal_max?: number | null
          temp_night_optimal_min?: number | null
          temp_night_tolerable_min?: number | null
          total_crop_duration?: number | null
          transplanting_to_harvest?: number | null
          trellising_required?: string | null
          varieties_common?: string | null
          water_requirement_per_day?: number | null
          water_stress_tolerance?: string | null
          yield_improvement_factor?: number | null
          yield_open_field_avg?: number | null
          yield_protected_avg?: number | null
        }
        Relationships: []
      }
      crop_structure_match: {
        Row: {
          crop_id: string | null
          match_id: number
          notes: string | null
          structure_id: string | null
          suitability_score: number | null
        }
        Insert: {
          crop_id?: string | null
          match_id?: number
          notes?: string | null
          structure_id?: string | null
          suitability_score?: number | null
        }
        Update: {
          crop_id?: string | null
          match_id?: number
          notes?: string | null
          structure_id?: string | null
          suitability_score?: number | null
        }
        Relationships: []
      }
      district_climate: {
        Row: {
          agro_climatic_zone: string | null
          annual_rainfall_avg: number | null
          cloudy_days_monsoon: number | null
          coastal_corrosion_factor: number | null
          cold_wave_days_jan: number | null
          cyclone_risk: string | null
          district_id: string
          district_name: string
          diurnal_temp_range_peak: number | null
          division_name: string | null
          dli_apr: number | null
          dli_aug: number | null
          dli_dec: number | null
          dli_feb: number | null
          dli_jan: number | null
          dli_jul: number | null
          dli_jun: number | null
          dli_mar: number | null
          dli_may: number | null
          dli_nov: number | null
          dli_oct: number | null
          dli_sep: number | null
          dominant_soil_type: string | null
          drought_frequency: number | null
          dust_storm_frequency: number | null
          elevation_masl: number | null
          flood_prone: string | null
          fog_days_dec: number | null
          fog_days_jan: number | null
          frost_days_dec: number | null
          frost_days_feb: number | null
          frost_days_jan: number | null
          hailstorm_frequency: number | null
          heat_wave_days_jun: number | null
          heat_wave_days_may: number | null
          latitude: number | null
          longitude: number | null
          monsoon_onset_avg: string | null
          monsoon_withdrawal_avg: string | null
          rainfall_apr: number | null
          rainfall_aug: number | null
          rainfall_dec: number | null
          rainfall_feb: number | null
          rainfall_intensity_peak: number | null
          rainfall_jan: number | null
          rainfall_jul: number | null
          rainfall_jun: number | null
          rainfall_mar: number | null
          rainfall_may: number | null
          rainfall_nov: number | null
          rainfall_oct: number | null
          rainfall_sep: number | null
          rainy_days_apr: number | null
          rainy_days_aug: number | null
          rainy_days_dec: number | null
          rainy_days_feb: number | null
          rainy_days_jan: number | null
          rainy_days_jul: number | null
          rainy_days_jun: number | null
          rainy_days_mar: number | null
          rainy_days_may: number | null
          rainy_days_nov: number | null
          rainy_days_oct: number | null
          rainy_days_sep: number | null
          rh_afternoon_avg_apr: number | null
          rh_afternoon_avg_aug: number | null
          rh_afternoon_avg_dec: number | null
          rh_afternoon_avg_feb: number | null
          rh_afternoon_avg_jan: number | null
          rh_afternoon_avg_jul: number | null
          rh_afternoon_avg_jun: number | null
          rh_afternoon_avg_mar: number | null
          rh_afternoon_avg_may: number | null
          rh_afternoon_avg_nov: number | null
          rh_afternoon_avg_oct: number | null
          rh_afternoon_avg_sep: number | null
          rh_max_monsoon: number | null
          rh_min_summer: number | null
          rh_morning_avg_apr: number | null
          rh_morning_avg_aug: number | null
          rh_morning_avg_dec: number | null
          rh_morning_avg_feb: number | null
          rh_morning_avg_jan: number | null
          rh_morning_avg_jul: number | null
          rh_morning_avg_jun: number | null
          rh_morning_avg_mar: number | null
          rh_morning_avg_may: number | null
          rh_morning_avg_nov: number | null
          rh_morning_avg_oct: number | null
          rh_morning_avg_sep: number | null
          soil_bearing_capacity: number | null
          soil_ec_avg: number | null
          soil_ph_avg: number | null
          solar_radiation_apr: number | null
          solar_radiation_aug: number | null
          solar_radiation_dec: number | null
          solar_radiation_feb: number | null
          solar_radiation_jan: number | null
          solar_radiation_jul: number | null
          solar_radiation_jun: number | null
          solar_radiation_mar: number | null
          solar_radiation_may: number | null
          solar_radiation_nov: number | null
          solar_radiation_oct: number | null
          solar_radiation_sep: number | null
          state: string
          sunshine_hours_apr: number | null
          sunshine_hours_aug: number | null
          sunshine_hours_dec: number | null
          sunshine_hours_feb: number | null
          sunshine_hours_jan: number | null
          sunshine_hours_jul: number | null
          sunshine_hours_jun: number | null
          sunshine_hours_mar: number | null
          sunshine_hours_may: number | null
          sunshine_hours_nov: number | null
          sunshine_hours_oct: number | null
          sunshine_hours_sep: number | null
          temp_max_absolute_apr: number | null
          temp_max_absolute_aug: number | null
          temp_max_absolute_dec: number | null
          temp_max_absolute_feb: number | null
          temp_max_absolute_jan: number | null
          temp_max_absolute_jul: number | null
          temp_max_absolute_jun: number | null
          temp_max_absolute_mar: number | null
          temp_max_absolute_may: number | null
          temp_max_absolute_nov: number | null
          temp_max_absolute_oct: number | null
          temp_max_absolute_sep: number | null
          temp_max_avg_apr: number | null
          temp_max_avg_aug: number | null
          temp_max_avg_dec: number | null
          temp_max_avg_feb: number | null
          temp_max_avg_jan: number | null
          temp_max_avg_jul: number | null
          temp_max_avg_jun: number | null
          temp_max_avg_mar: number | null
          temp_max_avg_may: number | null
          temp_max_avg_nov: number | null
          temp_max_avg_oct: number | null
          temp_max_avg_sep: number | null
          temp_min_absolute_apr: number | null
          temp_min_absolute_aug: number | null
          temp_min_absolute_dec: number | null
          temp_min_absolute_feb: number | null
          temp_min_absolute_jan: number | null
          temp_min_absolute_jul: number | null
          temp_min_absolute_jun: number | null
          temp_min_absolute_mar: number | null
          temp_min_absolute_may: number | null
          temp_min_absolute_nov: number | null
          temp_min_absolute_oct: number | null
          temp_min_absolute_sep: number | null
          temp_min_avg_apr: number | null
          temp_min_avg_aug: number | null
          temp_min_avg_dec: number | null
          temp_min_avg_feb: number | null
          temp_min_avg_jan: number | null
          temp_min_avg_jul: number | null
          temp_min_avg_jun: number | null
          temp_min_avg_mar: number | null
          temp_min_avg_may: number | null
          temp_min_avg_nov: number | null
          temp_min_avg_oct: number | null
          temp_min_avg_sep: number | null
          water_table_depth_postmonsoon: number | null
          water_table_depth_premonsoon: number | null
          wind_direction_monsoon_dominant: string | null
          wind_direction_summer_dominant: string | null
          wind_gust_max: number | null
          wind_speed_avg_apr: number | null
          wind_speed_avg_aug: number | null
          wind_speed_avg_dec: number | null
          wind_speed_avg_feb: number | null
          wind_speed_avg_jan: number | null
          wind_speed_avg_jul: number | null
          wind_speed_avg_jun: number | null
          wind_speed_avg_mar: number | null
          wind_speed_avg_may: number | null
          wind_speed_avg_nov: number | null
          wind_speed_avg_oct: number | null
          wind_speed_avg_sep: number | null
          wind_speed_max_monsoon: number | null
          wind_speed_max_recorded: number | null
          wind_speed_max_summer: number | null
        }
        Insert: {
          agro_climatic_zone?: string | null
          annual_rainfall_avg?: number | null
          cloudy_days_monsoon?: number | null
          coastal_corrosion_factor?: number | null
          cold_wave_days_jan?: number | null
          cyclone_risk?: string | null
          district_id: string
          district_name: string
          diurnal_temp_range_peak?: number | null
          division_name?: string | null
          dli_apr?: number | null
          dli_aug?: number | null
          dli_dec?: number | null
          dli_feb?: number | null
          dli_jan?: number | null
          dli_jul?: number | null
          dli_jun?: number | null
          dli_mar?: number | null
          dli_may?: number | null
          dli_nov?: number | null
          dli_oct?: number | null
          dli_sep?: number | null
          dominant_soil_type?: string | null
          drought_frequency?: number | null
          dust_storm_frequency?: number | null
          elevation_masl?: number | null
          flood_prone?: string | null
          fog_days_dec?: number | null
          fog_days_jan?: number | null
          frost_days_dec?: number | null
          frost_days_feb?: number | null
          frost_days_jan?: number | null
          hailstorm_frequency?: number | null
          heat_wave_days_jun?: number | null
          heat_wave_days_may?: number | null
          latitude?: number | null
          longitude?: number | null
          monsoon_onset_avg?: string | null
          monsoon_withdrawal_avg?: string | null
          rainfall_apr?: number | null
          rainfall_aug?: number | null
          rainfall_dec?: number | null
          rainfall_feb?: number | null
          rainfall_intensity_peak?: number | null
          rainfall_jan?: number | null
          rainfall_jul?: number | null
          rainfall_jun?: number | null
          rainfall_mar?: number | null
          rainfall_may?: number | null
          rainfall_nov?: number | null
          rainfall_oct?: number | null
          rainfall_sep?: number | null
          rainy_days_apr?: number | null
          rainy_days_aug?: number | null
          rainy_days_dec?: number | null
          rainy_days_feb?: number | null
          rainy_days_jan?: number | null
          rainy_days_jul?: number | null
          rainy_days_jun?: number | null
          rainy_days_mar?: number | null
          rainy_days_may?: number | null
          rainy_days_nov?: number | null
          rainy_days_oct?: number | null
          rainy_days_sep?: number | null
          rh_afternoon_avg_apr?: number | null
          rh_afternoon_avg_aug?: number | null
          rh_afternoon_avg_dec?: number | null
          rh_afternoon_avg_feb?: number | null
          rh_afternoon_avg_jan?: number | null
          rh_afternoon_avg_jul?: number | null
          rh_afternoon_avg_jun?: number | null
          rh_afternoon_avg_mar?: number | null
          rh_afternoon_avg_may?: number | null
          rh_afternoon_avg_nov?: number | null
          rh_afternoon_avg_oct?: number | null
          rh_afternoon_avg_sep?: number | null
          rh_max_monsoon?: number | null
          rh_min_summer?: number | null
          rh_morning_avg_apr?: number | null
          rh_morning_avg_aug?: number | null
          rh_morning_avg_dec?: number | null
          rh_morning_avg_feb?: number | null
          rh_morning_avg_jan?: number | null
          rh_morning_avg_jul?: number | null
          rh_morning_avg_jun?: number | null
          rh_morning_avg_mar?: number | null
          rh_morning_avg_may?: number | null
          rh_morning_avg_nov?: number | null
          rh_morning_avg_oct?: number | null
          rh_morning_avg_sep?: number | null
          soil_bearing_capacity?: number | null
          soil_ec_avg?: number | null
          soil_ph_avg?: number | null
          solar_radiation_apr?: number | null
          solar_radiation_aug?: number | null
          solar_radiation_dec?: number | null
          solar_radiation_feb?: number | null
          solar_radiation_jan?: number | null
          solar_radiation_jul?: number | null
          solar_radiation_jun?: number | null
          solar_radiation_mar?: number | null
          solar_radiation_may?: number | null
          solar_radiation_nov?: number | null
          solar_radiation_oct?: number | null
          solar_radiation_sep?: number | null
          state: string
          sunshine_hours_apr?: number | null
          sunshine_hours_aug?: number | null
          sunshine_hours_dec?: number | null
          sunshine_hours_feb?: number | null
          sunshine_hours_jan?: number | null
          sunshine_hours_jul?: number | null
          sunshine_hours_jun?: number | null
          sunshine_hours_mar?: number | null
          sunshine_hours_may?: number | null
          sunshine_hours_nov?: number | null
          sunshine_hours_oct?: number | null
          sunshine_hours_sep?: number | null
          temp_max_absolute_apr?: number | null
          temp_max_absolute_aug?: number | null
          temp_max_absolute_dec?: number | null
          temp_max_absolute_feb?: number | null
          temp_max_absolute_jan?: number | null
          temp_max_absolute_jul?: number | null
          temp_max_absolute_jun?: number | null
          temp_max_absolute_mar?: number | null
          temp_max_absolute_may?: number | null
          temp_max_absolute_nov?: number | null
          temp_max_absolute_oct?: number | null
          temp_max_absolute_sep?: number | null
          temp_max_avg_apr?: number | null
          temp_max_avg_aug?: number | null
          temp_max_avg_dec?: number | null
          temp_max_avg_feb?: number | null
          temp_max_avg_jan?: number | null
          temp_max_avg_jul?: number | null
          temp_max_avg_jun?: number | null
          temp_max_avg_mar?: number | null
          temp_max_avg_may?: number | null
          temp_max_avg_nov?: number | null
          temp_max_avg_oct?: number | null
          temp_max_avg_sep?: number | null
          temp_min_absolute_apr?: number | null
          temp_min_absolute_aug?: number | null
          temp_min_absolute_dec?: number | null
          temp_min_absolute_feb?: number | null
          temp_min_absolute_jan?: number | null
          temp_min_absolute_jul?: number | null
          temp_min_absolute_jun?: number | null
          temp_min_absolute_mar?: number | null
          temp_min_absolute_may?: number | null
          temp_min_absolute_nov?: number | null
          temp_min_absolute_oct?: number | null
          temp_min_absolute_sep?: number | null
          temp_min_avg_apr?: number | null
          temp_min_avg_aug?: number | null
          temp_min_avg_dec?: number | null
          temp_min_avg_feb?: number | null
          temp_min_avg_jan?: number | null
          temp_min_avg_jul?: number | null
          temp_min_avg_jun?: number | null
          temp_min_avg_mar?: number | null
          temp_min_avg_may?: number | null
          temp_min_avg_nov?: number | null
          temp_min_avg_oct?: number | null
          temp_min_avg_sep?: number | null
          water_table_depth_postmonsoon?: number | null
          water_table_depth_premonsoon?: number | null
          wind_direction_monsoon_dominant?: string | null
          wind_direction_summer_dominant?: string | null
          wind_gust_max?: number | null
          wind_speed_avg_apr?: number | null
          wind_speed_avg_aug?: number | null
          wind_speed_avg_dec?: number | null
          wind_speed_avg_feb?: number | null
          wind_speed_avg_jan?: number | null
          wind_speed_avg_jul?: number | null
          wind_speed_avg_jun?: number | null
          wind_speed_avg_mar?: number | null
          wind_speed_avg_may?: number | null
          wind_speed_avg_nov?: number | null
          wind_speed_avg_oct?: number | null
          wind_speed_avg_sep?: number | null
          wind_speed_max_monsoon?: number | null
          wind_speed_max_recorded?: number | null
          wind_speed_max_summer?: number | null
        }
        Update: {
          agro_climatic_zone?: string | null
          annual_rainfall_avg?: number | null
          cloudy_days_monsoon?: number | null
          coastal_corrosion_factor?: number | null
          cold_wave_days_jan?: number | null
          cyclone_risk?: string | null
          district_id?: string
          district_name?: string
          diurnal_temp_range_peak?: number | null
          division_name?: string | null
          dli_apr?: number | null
          dli_aug?: number | null
          dli_dec?: number | null
          dli_feb?: number | null
          dli_jan?: number | null
          dli_jul?: number | null
          dli_jun?: number | null
          dli_mar?: number | null
          dli_may?: number | null
          dli_nov?: number | null
          dli_oct?: number | null
          dli_sep?: number | null
          dominant_soil_type?: string | null
          drought_frequency?: number | null
          dust_storm_frequency?: number | null
          elevation_masl?: number | null
          flood_prone?: string | null
          fog_days_dec?: number | null
          fog_days_jan?: number | null
          frost_days_dec?: number | null
          frost_days_feb?: number | null
          frost_days_jan?: number | null
          hailstorm_frequency?: number | null
          heat_wave_days_jun?: number | null
          heat_wave_days_may?: number | null
          latitude?: number | null
          longitude?: number | null
          monsoon_onset_avg?: string | null
          monsoon_withdrawal_avg?: string | null
          rainfall_apr?: number | null
          rainfall_aug?: number | null
          rainfall_dec?: number | null
          rainfall_feb?: number | null
          rainfall_intensity_peak?: number | null
          rainfall_jan?: number | null
          rainfall_jul?: number | null
          rainfall_jun?: number | null
          rainfall_mar?: number | null
          rainfall_may?: number | null
          rainfall_nov?: number | null
          rainfall_oct?: number | null
          rainfall_sep?: number | null
          rainy_days_apr?: number | null
          rainy_days_aug?: number | null
          rainy_days_dec?: number | null
          rainy_days_feb?: number | null
          rainy_days_jan?: number | null
          rainy_days_jul?: number | null
          rainy_days_jun?: number | null
          rainy_days_mar?: number | null
          rainy_days_may?: number | null
          rainy_days_nov?: number | null
          rainy_days_oct?: number | null
          rainy_days_sep?: number | null
          rh_afternoon_avg_apr?: number | null
          rh_afternoon_avg_aug?: number | null
          rh_afternoon_avg_dec?: number | null
          rh_afternoon_avg_feb?: number | null
          rh_afternoon_avg_jan?: number | null
          rh_afternoon_avg_jul?: number | null
          rh_afternoon_avg_jun?: number | null
          rh_afternoon_avg_mar?: number | null
          rh_afternoon_avg_may?: number | null
          rh_afternoon_avg_nov?: number | null
          rh_afternoon_avg_oct?: number | null
          rh_afternoon_avg_sep?: number | null
          rh_max_monsoon?: number | null
          rh_min_summer?: number | null
          rh_morning_avg_apr?: number | null
          rh_morning_avg_aug?: number | null
          rh_morning_avg_dec?: number | null
          rh_morning_avg_feb?: number | null
          rh_morning_avg_jan?: number | null
          rh_morning_avg_jul?: number | null
          rh_morning_avg_jun?: number | null
          rh_morning_avg_mar?: number | null
          rh_morning_avg_may?: number | null
          rh_morning_avg_nov?: number | null
          rh_morning_avg_oct?: number | null
          rh_morning_avg_sep?: number | null
          soil_bearing_capacity?: number | null
          soil_ec_avg?: number | null
          soil_ph_avg?: number | null
          solar_radiation_apr?: number | null
          solar_radiation_aug?: number | null
          solar_radiation_dec?: number | null
          solar_radiation_feb?: number | null
          solar_radiation_jan?: number | null
          solar_radiation_jul?: number | null
          solar_radiation_jun?: number | null
          solar_radiation_mar?: number | null
          solar_radiation_may?: number | null
          solar_radiation_nov?: number | null
          solar_radiation_oct?: number | null
          solar_radiation_sep?: number | null
          state?: string
          sunshine_hours_apr?: number | null
          sunshine_hours_aug?: number | null
          sunshine_hours_dec?: number | null
          sunshine_hours_feb?: number | null
          sunshine_hours_jan?: number | null
          sunshine_hours_jul?: number | null
          sunshine_hours_jun?: number | null
          sunshine_hours_mar?: number | null
          sunshine_hours_may?: number | null
          sunshine_hours_nov?: number | null
          sunshine_hours_oct?: number | null
          sunshine_hours_sep?: number | null
          temp_max_absolute_apr?: number | null
          temp_max_absolute_aug?: number | null
          temp_max_absolute_dec?: number | null
          temp_max_absolute_feb?: number | null
          temp_max_absolute_jan?: number | null
          temp_max_absolute_jul?: number | null
          temp_max_absolute_jun?: number | null
          temp_max_absolute_mar?: number | null
          temp_max_absolute_may?: number | null
          temp_max_absolute_nov?: number | null
          temp_max_absolute_oct?: number | null
          temp_max_absolute_sep?: number | null
          temp_max_avg_apr?: number | null
          temp_max_avg_aug?: number | null
          temp_max_avg_dec?: number | null
          temp_max_avg_feb?: number | null
          temp_max_avg_jan?: number | null
          temp_max_avg_jul?: number | null
          temp_max_avg_jun?: number | null
          temp_max_avg_mar?: number | null
          temp_max_avg_may?: number | null
          temp_max_avg_nov?: number | null
          temp_max_avg_oct?: number | null
          temp_max_avg_sep?: number | null
          temp_min_absolute_apr?: number | null
          temp_min_absolute_aug?: number | null
          temp_min_absolute_dec?: number | null
          temp_min_absolute_feb?: number | null
          temp_min_absolute_jan?: number | null
          temp_min_absolute_jul?: number | null
          temp_min_absolute_jun?: number | null
          temp_min_absolute_mar?: number | null
          temp_min_absolute_may?: number | null
          temp_min_absolute_nov?: number | null
          temp_min_absolute_oct?: number | null
          temp_min_absolute_sep?: number | null
          temp_min_avg_apr?: number | null
          temp_min_avg_aug?: number | null
          temp_min_avg_dec?: number | null
          temp_min_avg_feb?: number | null
          temp_min_avg_jan?: number | null
          temp_min_avg_jul?: number | null
          temp_min_avg_jun?: number | null
          temp_min_avg_mar?: number | null
          temp_min_avg_may?: number | null
          temp_min_avg_nov?: number | null
          temp_min_avg_oct?: number | null
          temp_min_avg_sep?: number | null
          water_table_depth_postmonsoon?: number | null
          water_table_depth_premonsoon?: number | null
          wind_direction_monsoon_dominant?: string | null
          wind_direction_summer_dominant?: string | null
          wind_gust_max?: number | null
          wind_speed_avg_apr?: number | null
          wind_speed_avg_aug?: number | null
          wind_speed_avg_dec?: number | null
          wind_speed_avg_feb?: number | null
          wind_speed_avg_jan?: number | null
          wind_speed_avg_jul?: number | null
          wind_speed_avg_jun?: number | null
          wind_speed_avg_mar?: number | null
          wind_speed_avg_may?: number | null
          wind_speed_avg_nov?: number | null
          wind_speed_avg_oct?: number | null
          wind_speed_avg_sep?: number | null
          wind_speed_max_monsoon?: number | null
          wind_speed_max_recorded?: number | null
          wind_speed_max_summer?: number | null
        }
        Relationships: []
      }
      farmer_microclimate_inputs: {
        Row: {
          altitude_masl: number | null
          aspect_direction: string | null
          created_date: string | null
          distance_to_water_source_m: number | null
          district_id: string | null
          existing_windbreak: string | null
          farmer_name: string | null
          field_location: string | null
          flood_risk: string | null
          frost_pocket: string | null
          infrastructure_data: Json | null
          input_id: number
          intelligence_confidence: string | null
          latitude: number | null
          longitude: number | null
          manual_answers: Json | null
          nearby_structure: string | null
          nearest_weather_station: string | null
          notes: string | null
          site_aspect: string | null
          site_elevation_m: number | null
          site_latitude: number | null
          site_longitude: number | null
          site_polygon: Json | null
          site_slope_percent: number | null
          slope_percent: number | null
          soil_ph: number | null
          soil_type: string | null
          water_quality: string | null
          water_source_type: string | null
        }
        Insert: {
          altitude_masl?: number | null
          aspect_direction?: string | null
          created_date?: string | null
          distance_to_water_source_m?: number | null
          district_id?: string | null
          existing_windbreak?: string | null
          farmer_name?: string | null
          field_location?: string | null
          flood_risk?: string | null
          frost_pocket?: string | null
          infrastructure_data?: Json | null
          input_id?: number
          intelligence_confidence?: string | null
          latitude?: number | null
          longitude?: number | null
          manual_answers?: Json | null
          nearby_structure?: string | null
          nearest_weather_station?: string | null
          notes?: string | null
          site_aspect?: string | null
          site_elevation_m?: number | null
          site_latitude?: number | null
          site_longitude?: number | null
          site_polygon?: Json | null
          site_slope_percent?: number | null
          slope_percent?: number | null
          soil_ph?: number | null
          soil_type?: string | null
          water_quality?: string | null
          water_source_type?: string | null
        }
        Update: {
          altitude_masl?: number | null
          aspect_direction?: string | null
          created_date?: string | null
          distance_to_water_source_m?: number | null
          district_id?: string | null
          existing_windbreak?: string | null
          farmer_name?: string | null
          field_location?: string | null
          flood_risk?: string | null
          frost_pocket?: string | null
          infrastructure_data?: Json | null
          input_id?: number
          intelligence_confidence?: string | null
          latitude?: number | null
          longitude?: number | null
          manual_answers?: Json | null
          nearby_structure?: string | null
          nearest_weather_station?: string | null
          notes?: string | null
          site_aspect?: string | null
          site_elevation_m?: number | null
          site_latitude?: number | null
          site_longitude?: number | null
          site_polygon?: Json | null
          site_slope_percent?: number | null
          slope_percent?: number | null
          soil_ph?: number | null
          soil_type?: string | null
          water_quality?: string | null
          water_source_type?: string | null
        }
        Relationships: []
      }
      foundation_matrix: {
        Row: {
          concrete_grade: string | null
          cost_per_column: number | null
          curing_days: number | null
          foundation_depth_cm: number | null
          foundation_type: string | null
          foundation_width_cm: number | null
          notes: string | null
          reinforcement: string | null
          soil_type: string
          structure_id: string
        }
        Insert: {
          concrete_grade?: string | null
          cost_per_column?: number | null
          curing_days?: number | null
          foundation_depth_cm?: number | null
          foundation_type?: string | null
          foundation_width_cm?: number | null
          notes?: string | null
          reinforcement?: string | null
          soil_type: string
          structure_id: string
        }
        Update: {
          concrete_grade?: string | null
          cost_per_column?: number | null
          curing_days?: number | null
          foundation_depth_cm?: number | null
          foundation_type?: string | null
          foundation_width_cm?: number | null
          notes?: string | null
          reinforcement?: string | null
          soil_type?: string
          structure_id?: string
        }
        Relationships: []
      }
      location_intelligence_cache: {
        Row: {
          annual_rainfall_mm: number | null
          annual_temp_max: number | null
          annual_temp_min: number | null
          api_response: Json | null
          aspect_direction: string | null
          buildings_within_500m: number | null
          cache_timestamp: string | null
          elevation_m: number | null
          flood_risk: string | null
          id: number
          latitude: number
          longitude: number
          nearest_road_distance_m: number | null
          nearest_settlement_name: string | null
          nearest_water_distance_m: number | null
          slope_percent: number | null
          soil_type: string | null
          weather_station_distance_m: number | null
        }
        Insert: {
          annual_rainfall_mm?: number | null
          annual_temp_max?: number | null
          annual_temp_min?: number | null
          api_response?: Json | null
          aspect_direction?: string | null
          buildings_within_500m?: number | null
          cache_timestamp?: string | null
          elevation_m?: number | null
          flood_risk?: string | null
          id?: number
          latitude: number
          longitude: number
          nearest_road_distance_m?: number | null
          nearest_settlement_name?: string | null
          nearest_water_distance_m?: number | null
          slope_percent?: number | null
          soil_type?: string | null
          weather_station_distance_m?: number | null
        }
        Update: {
          annual_rainfall_mm?: number | null
          annual_temp_max?: number | null
          annual_temp_min?: number | null
          api_response?: Json | null
          aspect_direction?: string | null
          buildings_within_500m?: number | null
          cache_timestamp?: string | null
          elevation_m?: number | null
          flood_risk?: string | null
          id?: number
          latitude?: number
          longitude?: number
          nearest_road_distance_m?: number | null
          nearest_settlement_name?: string | null
          nearest_water_distance_m?: number | null
          slope_percent?: number | null
          soil_type?: string | null
          weather_station_distance_m?: number | null
        }
        Relationships: []
      }
      mandi_prices: {
        Row: {
          market_location: string | null
          material_id: string | null
          price_date: string | null
          price_id: number
          price_per_unit: number | null
          price_source: string | null
        }
        Insert: {
          market_location?: string | null
          material_id?: string | null
          price_date?: string | null
          price_id?: number
          price_per_unit?: number | null
          price_source?: string | null
        }
        Update: {
          market_location?: string | null
          material_id?: string | null
          price_date?: string | null
          price_id?: number
          price_per_unit?: number | null
          price_source?: string | null
        }
        Relationships: []
      }
      material_categories: {
        Row: {
          category_id: string
          category_name: string | null
          description: string | null
        }
        Insert: {
          category_id: string
          category_name?: string | null
          description?: string | null
        }
        Update: {
          category_id?: string
          category_name?: string | null
          description?: string | null
        }
        Relationships: []
      }
      materials: {
        Row: {
          category_id: string | null
          dependency: string | null
          description: string | null
          item_type: string | null
          material_id: string
          material_name: string
          nearest_supply_hub: string | null
          needed_for_structures: string | null
          price_last_verified: string | null
          price_source: string | null
          price_staleness_days: number | null
          quantity_formula: string | null
          standard_is_code: string | null
          sub_category: string | null
          tier_a_brand_examples: string | null
          tier_a_lifespan: number | null
          tier_a_price_hp: number | null
          tier_a_price_mh: number | null
          tier_a_price_mp: number | null
          tier_a_price_uk: number | null
          tier_a_price_up: number | null
          tier_a_spec: string | null
          tier_b_brand_examples: string | null
          tier_b_downgrade_consequence: string | null
          tier_b_lifespan: number | null
          tier_b_price_hp: number | null
          tier_b_price_mh: number | null
          tier_b_price_mp: number | null
          tier_b_price_uk: number | null
          tier_b_price_up: number | null
          tier_b_spec: string | null
          tier_c_brand_examples: string | null
          tier_c_downgrade_consequence: string | null
          tier_c_lifespan: number | null
          tier_c_price_hp: number | null
          tier_c_price_mh: number | null
          tier_c_price_mp: number | null
          tier_c_price_uk: number | null
          tier_c_price_up: number | null
          tier_c_spec: string | null
          transport_cost_per_km_per_ton: number | null
          transport_mode: string | null
          unit_of_measurement: string | null
          wastage_factor: number | null
        }
        Insert: {
          category_id?: string | null
          dependency?: string | null
          description?: string | null
          item_type?: string | null
          material_id: string
          material_name: string
          nearest_supply_hub?: string | null
          needed_for_structures?: string | null
          price_last_verified?: string | null
          price_source?: string | null
          price_staleness_days?: number | null
          quantity_formula?: string | null
          standard_is_code?: string | null
          sub_category?: string | null
          tier_a_brand_examples?: string | null
          tier_a_lifespan?: number | null
          tier_a_price_hp?: number | null
          tier_a_price_mh?: number | null
          tier_a_price_mp?: number | null
          tier_a_price_uk?: number | null
          tier_a_price_up?: number | null
          tier_a_spec?: string | null
          tier_b_brand_examples?: string | null
          tier_b_downgrade_consequence?: string | null
          tier_b_lifespan?: number | null
          tier_b_price_hp?: number | null
          tier_b_price_mh?: number | null
          tier_b_price_mp?: number | null
          tier_b_price_uk?: number | null
          tier_b_price_up?: number | null
          tier_b_spec?: string | null
          tier_c_brand_examples?: string | null
          tier_c_downgrade_consequence?: string | null
          tier_c_lifespan?: number | null
          tier_c_price_hp?: number | null
          tier_c_price_mh?: number | null
          tier_c_price_mp?: number | null
          tier_c_price_uk?: number | null
          tier_c_price_up?: number | null
          tier_c_spec?: string | null
          transport_cost_per_km_per_ton?: number | null
          transport_mode?: string | null
          unit_of_measurement?: string | null
          wastage_factor?: number | null
        }
        Update: {
          category_id?: string | null
          dependency?: string | null
          description?: string | null
          item_type?: string | null
          material_id?: string
          material_name?: string
          nearest_supply_hub?: string | null
          needed_for_structures?: string | null
          price_last_verified?: string | null
          price_source?: string | null
          price_staleness_days?: number | null
          quantity_formula?: string | null
          standard_is_code?: string | null
          sub_category?: string | null
          tier_a_brand_examples?: string | null
          tier_a_lifespan?: number | null
          tier_a_price_hp?: number | null
          tier_a_price_mh?: number | null
          tier_a_price_mp?: number | null
          tier_a_price_uk?: number | null
          tier_a_price_up?: number | null
          tier_a_spec?: string | null
          tier_b_brand_examples?: string | null
          tier_b_downgrade_consequence?: string | null
          tier_b_lifespan?: number | null
          tier_b_price_hp?: number | null
          tier_b_price_mh?: number | null
          tier_b_price_mp?: number | null
          tier_b_price_uk?: number | null
          tier_b_price_up?: number | null
          tier_b_spec?: string | null
          tier_c_brand_examples?: string | null
          tier_c_downgrade_consequence?: string | null
          tier_c_lifespan?: number | null
          tier_c_price_hp?: number | null
          tier_c_price_mh?: number | null
          tier_c_price_mp?: number | null
          tier_c_price_uk?: number | null
          tier_c_price_up?: number | null
          tier_c_spec?: string | null
          transport_cost_per_km_per_ton?: number | null
          transport_mode?: string | null
          unit_of_measurement?: string | null
          wastage_factor?: number | null
        }
        Relationships: []
      }
      monthly_market_prices: {
        Row: {
          avg_price_per_quintal: number | null
          crop_id: string
          data_source: string | null
          is_verified: number | null
          mandi_name: string | null
          market_name: string | null
          max_price_per_quintal: number | null
          min_price_per_quintal: number | null
          month: number
          price_cv_percent: number | null
          state: string
          year: number | null
        }
        Insert: {
          avg_price_per_quintal?: number | null
          crop_id: string
          data_source?: string | null
          is_verified?: number | null
          mandi_name?: string | null
          market_name?: string | null
          max_price_per_quintal?: number | null
          min_price_per_quintal?: number | null
          month: number
          price_cv_percent?: number | null
          state: string
          year?: number | null
        }
        Update: {
          avg_price_per_quintal?: number | null
          crop_id?: string
          data_source?: string | null
          is_verified?: number | null
          mandi_name?: string | null
          market_name?: string | null
          max_price_per_quintal?: number | null
          min_price_per_quintal?: number | null
          month?: number
          price_cv_percent?: number | null
          state?: string
          year?: number | null
        }
        Relationships: []
      }
      multispan_performance: {
        Row: {
          center_span_heat_factor: number | null
          cost_premium_percent: number | null
          humidity_control: string | null
          notes: string | null
          span_count: number
          structure_id: string
          temp_reduction_summer: number | null
          ventilation_rate: number | null
        }
        Insert: {
          center_span_heat_factor?: number | null
          cost_premium_percent?: number | null
          humidity_control?: string | null
          notes?: string | null
          span_count: number
          structure_id: string
          temp_reduction_summer?: number | null
          ventilation_rate?: number | null
        }
        Update: {
          center_span_heat_factor?: number | null
          cost_premium_percent?: number | null
          humidity_control?: string | null
          notes?: string | null
          span_count?: number
          structure_id?: string
          temp_reduction_summer?: number | null
          ventilation_rate?: number | null
        }
        Relationships: []
      }
      operating_costs: {
        Row: {
          annual_revenue: number | null
          area_sqm: number | null
          crop_id: string
          data_source: string | null
          electricity_monthly: number | null
          fertilizer_annual: number | null
          id: number
          insurance_annual: number | null
          labour_monthly: number | null
          last_verified: string | null
          maintenance_annual: number | null
          net_10yr_return: number | null
          other_annual: number | null
          payback_years: number | null
          pesticide_annual: number | null
          price_per_kg: number | null
          replacement_schedule: string | null
          seed_seedling_annual: number | null
          state: string
          structure_id: string
          total_10yr_operating: number | null
          total_10yr_replacement: number | null
          total_10yr_revenue: number | null
          total_10yr_tco: number | null
          total_annual_operating: number | null
          water_monthly: number | null
          yield_per_sqm_kg: number | null
        }
        Insert: {
          annual_revenue?: number | null
          area_sqm?: number | null
          crop_id: string
          data_source?: string | null
          electricity_monthly?: number | null
          fertilizer_annual?: number | null
          id?: number
          insurance_annual?: number | null
          labour_monthly?: number | null
          last_verified?: string | null
          maintenance_annual?: number | null
          net_10yr_return?: number | null
          other_annual?: number | null
          payback_years?: number | null
          pesticide_annual?: number | null
          price_per_kg?: number | null
          replacement_schedule?: string | null
          seed_seedling_annual?: number | null
          state: string
          structure_id: string
          total_10yr_operating?: number | null
          total_10yr_replacement?: number | null
          total_10yr_revenue?: number | null
          total_10yr_tco?: number | null
          total_annual_operating?: number | null
          water_monthly?: number | null
          yield_per_sqm_kg?: number | null
        }
        Update: {
          annual_revenue?: number | null
          area_sqm?: number | null
          crop_id?: string
          data_source?: string | null
          electricity_monthly?: number | null
          fertilizer_annual?: number | null
          id?: number
          insurance_annual?: number | null
          labour_monthly?: number | null
          last_verified?: string | null
          maintenance_annual?: number | null
          net_10yr_return?: number | null
          other_annual?: number | null
          payback_years?: number | null
          pesticide_annual?: number | null
          price_per_kg?: number | null
          replacement_schedule?: string | null
          seed_seedling_annual?: number | null
          state?: string
          structure_id?: string
          total_10yr_operating?: number | null
          total_10yr_replacement?: number | null
          total_10yr_revenue?: number | null
          total_10yr_tco?: number | null
          total_annual_operating?: number | null
          water_monthly?: number | null
          yield_per_sqm_kg?: number | null
        }
        Relationships: []
      }
      pest_risk_matrix: {
        Row: {
          chemical_cost_open_field: number | null
          crop_id: string | null
          insect_net_required: string | null
          mesh_size_required: number | null
          pest_id: string
          pest_name: string | null
          pest_type: string | null
          risk_level_mh_konkan: string | null
          risk_level_mh_marathwada: string | null
          risk_level_mh_vidarbha: string | null
          risk_level_mp: string | null
          risk_level_up: string | null
          season_of_peak_risk: string | null
          side_curtain_required: string | null
        }
        Insert: {
          chemical_cost_open_field?: number | null
          crop_id?: string | null
          insect_net_required?: string | null
          mesh_size_required?: number | null
          pest_id: string
          pest_name?: string | null
          pest_type?: string | null
          risk_level_mh_konkan?: string | null
          risk_level_mh_marathwada?: string | null
          risk_level_mh_vidarbha?: string | null
          risk_level_mp?: string | null
          risk_level_up?: string | null
          season_of_peak_risk?: string | null
          side_curtain_required?: string | null
        }
        Update: {
          chemical_cost_open_field?: number | null
          crop_id?: string | null
          insect_net_required?: string | null
          mesh_size_required?: number | null
          pest_id?: string
          pest_name?: string | null
          pest_type?: string | null
          risk_level_mh_konkan?: string | null
          risk_level_mh_marathwada?: string | null
          risk_level_mh_vidarbha?: string | null
          risk_level_mp?: string | null
          risk_level_up?: string | null
          season_of_peak_risk?: string | null
          side_curtain_required?: string | null
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          alert_id: number
          alert_type: string | null
          change_percent: number | null
          material_id: string | null
          new_price: number | null
          old_price: number | null
          recorded_date: string | null
          source: string | null
          state: string | null
        }
        Insert: {
          alert_id?: number
          alert_type?: string | null
          change_percent?: number | null
          material_id?: string | null
          new_price?: number | null
          old_price?: number | null
          recorded_date?: string | null
          source?: string | null
          state?: string | null
        }
        Update: {
          alert_id?: number
          alert_type?: string | null
          change_percent?: number | null
          material_id?: string | null
          new_price?: number | null
          old_price?: number | null
          recorded_date?: string | null
          source?: string | null
          state?: string | null
        }
        Relationships: []
      }
      structure_data: {
        Row: {
          bay_length: number | null
          column_spacing: number | null
          cost_last_updated: string | null
          cost_per_sqm_mh_max: number | null
          cost_per_sqm_mh_min: number | null
          cost_per_sqm_mp_max: number | null
          cost_per_sqm_mp_min: number | null
          cost_per_sqm_up_max: number | null
          cost_per_sqm_up_min: number | null
          cost_variation_reason: string | null
          covering_material_lifespan: number | null
          description_plain_language: string | null
          eligible_mh_horticulture_mission: string | null
          eligible_mp_horticulture_mission: string | null
          eligible_nhm_national: string | null
          eligible_up_horticulture_mission: string | null
          foundation_depth_required: number | null
          foundation_type_required: string | null
          gutter_height: number | null
          hailstorm_suitable: string | null
          humidity_increase_capability: number | null
          humidity_reduction_capability: number | null
          humidity_zone_suitable: string | null
          light_transmission: number | null
          maintenance_cost_annual: number | null
          maintenance_frequency: string | null
          pest_exclusion_rating: string | null
          rainfall_intensity_max: number | null
          replacement_components: string | null
          ridge_height: number | null
          roof_slope_angle: number | null
          span_type: string | null
          standard_length_max: number | null
          standard_length_min: number | null
          standard_width: number | null
          structural_lifespan: number | null
          structure_category: string | null
          structure_id: string
          structure_name: string
          subsidy_ceiling_amount_mh: number | null
          subsidy_ceiling_amount_mp: number | null
          subsidy_ceiling_amount_up: number | null
          subsidy_percent_mh: number | null
          subsidy_percent_mp: number | null
          subsidy_percent_up: number | null
          suitable_agro_zones_mh: string | null
          suitable_agro_zones_mp: string | null
          suitable_agro_zones_up: string | null
          summer_max_temp_suitable: number | null
          temp_increase_winter: number | null
          temp_reduction_summer_active: number | null
          temp_reduction_summer_passive: number | null
          wind_speed_inside: number | null
          wind_speed_max_rated: number | null
          winter_min_temp_suitable: number | null
        }
        Insert: {
          bay_length?: number | null
          column_spacing?: number | null
          cost_last_updated?: string | null
          cost_per_sqm_mh_max?: number | null
          cost_per_sqm_mh_min?: number | null
          cost_per_sqm_mp_max?: number | null
          cost_per_sqm_mp_min?: number | null
          cost_per_sqm_up_max?: number | null
          cost_per_sqm_up_min?: number | null
          cost_variation_reason?: string | null
          covering_material_lifespan?: number | null
          description_plain_language?: string | null
          eligible_mh_horticulture_mission?: string | null
          eligible_mp_horticulture_mission?: string | null
          eligible_nhm_national?: string | null
          eligible_up_horticulture_mission?: string | null
          foundation_depth_required?: number | null
          foundation_type_required?: string | null
          gutter_height?: number | null
          hailstorm_suitable?: string | null
          humidity_increase_capability?: number | null
          humidity_reduction_capability?: number | null
          humidity_zone_suitable?: string | null
          light_transmission?: number | null
          maintenance_cost_annual?: number | null
          maintenance_frequency?: string | null
          pest_exclusion_rating?: string | null
          rainfall_intensity_max?: number | null
          replacement_components?: string | null
          ridge_height?: number | null
          roof_slope_angle?: number | null
          span_type?: string | null
          standard_length_max?: number | null
          standard_length_min?: number | null
          standard_width?: number | null
          structural_lifespan?: number | null
          structure_category?: string | null
          structure_id: string
          structure_name: string
          subsidy_ceiling_amount_mh?: number | null
          subsidy_ceiling_amount_mp?: number | null
          subsidy_ceiling_amount_up?: number | null
          subsidy_percent_mh?: number | null
          subsidy_percent_mp?: number | null
          subsidy_percent_up?: number | null
          suitable_agro_zones_mh?: string | null
          suitable_agro_zones_mp?: string | null
          suitable_agro_zones_up?: string | null
          summer_max_temp_suitable?: number | null
          temp_increase_winter?: number | null
          temp_reduction_summer_active?: number | null
          temp_reduction_summer_passive?: number | null
          wind_speed_inside?: number | null
          wind_speed_max_rated?: number | null
          winter_min_temp_suitable?: number | null
        }
        Update: {
          bay_length?: number | null
          column_spacing?: number | null
          cost_last_updated?: string | null
          cost_per_sqm_mh_max?: number | null
          cost_per_sqm_mh_min?: number | null
          cost_per_sqm_mp_max?: number | null
          cost_per_sqm_mp_min?: number | null
          cost_per_sqm_up_max?: number | null
          cost_per_sqm_up_min?: number | null
          cost_variation_reason?: string | null
          covering_material_lifespan?: number | null
          description_plain_language?: string | null
          eligible_mh_horticulture_mission?: string | null
          eligible_mp_horticulture_mission?: string | null
          eligible_nhm_national?: string | null
          eligible_up_horticulture_mission?: string | null
          foundation_depth_required?: number | null
          foundation_type_required?: string | null
          gutter_height?: number | null
          hailstorm_suitable?: string | null
          humidity_increase_capability?: number | null
          humidity_reduction_capability?: number | null
          humidity_zone_suitable?: string | null
          light_transmission?: number | null
          maintenance_cost_annual?: number | null
          maintenance_frequency?: string | null
          pest_exclusion_rating?: string | null
          rainfall_intensity_max?: number | null
          replacement_components?: string | null
          ridge_height?: number | null
          roof_slope_angle?: number | null
          span_type?: string | null
          standard_length_max?: number | null
          standard_length_min?: number | null
          standard_width?: number | null
          structural_lifespan?: number | null
          structure_category?: string | null
          structure_id?: string
          structure_name?: string
          subsidy_ceiling_amount_mh?: number | null
          subsidy_ceiling_amount_mp?: number | null
          subsidy_ceiling_amount_up?: number | null
          subsidy_percent_mh?: number | null
          subsidy_percent_mp?: number | null
          subsidy_percent_up?: number | null
          suitable_agro_zones_mh?: string | null
          suitable_agro_zones_mp?: string | null
          suitable_agro_zones_up?: string | null
          summer_max_temp_suitable?: number | null
          temp_increase_winter?: number | null
          temp_reduction_summer_active?: number | null
          temp_reduction_summer_passive?: number | null
          wind_speed_inside?: number | null
          wind_speed_max_rated?: number | null
          winter_min_temp_suitable?: number | null
        }
        Relationships: []
      }
      subsidy_schemes: {
        Row: {
          applicable_states: string | null
          crops_eligible: string | null
          documentation_required: string | null
          farmer_category_eligible: string | null
          first_time_only: string | null
          implementing_agency: string | null
          land_type_required: string | null
          last_verified: string | null
          loan_linkage_required: string | null
          max_area_sqm: number | null
          max_land_holding: number | null
          min_area_sqm: number | null
          min_land_holding: number | null
          own_contribution_min: number | null
          scheme_id: string
          scheme_name: string
          scheme_type: string | null
          scheme_year_valid: string | null
          source_url: string | null
          structures_eligible: string | null
          subsidy_ceiling_per_unit: number | null
          subsidy_ceiling_total: number | null
          subsidy_percent_general: number | null
          subsidy_percent_sc_st: number | null
          subsidy_percent_women: number | null
          subsidy_release_mode: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          applicable_states?: string | null
          crops_eligible?: string | null
          documentation_required?: string | null
          farmer_category_eligible?: string | null
          first_time_only?: string | null
          implementing_agency?: string | null
          land_type_required?: string | null
          last_verified?: string | null
          loan_linkage_required?: string | null
          max_area_sqm?: number | null
          max_land_holding?: number | null
          min_area_sqm?: number | null
          min_land_holding?: number | null
          own_contribution_min?: number | null
          scheme_id: string
          scheme_name: string
          scheme_type?: string | null
          scheme_year_valid?: string | null
          source_url?: string | null
          structures_eligible?: string | null
          subsidy_ceiling_per_unit?: number | null
          subsidy_ceiling_total?: number | null
          subsidy_percent_general?: number | null
          subsidy_percent_sc_st?: number | null
          subsidy_percent_women?: number | null
          subsidy_release_mode?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          applicable_states?: string | null
          crops_eligible?: string | null
          documentation_required?: string | null
          farmer_category_eligible?: string | null
          first_time_only?: string | null
          implementing_agency?: string | null
          land_type_required?: string | null
          last_verified?: string | null
          loan_linkage_required?: string | null
          max_area_sqm?: number | null
          max_land_holding?: number | null
          min_area_sqm?: number | null
          min_land_holding?: number | null
          own_contribution_min?: number | null
          scheme_id?: string
          scheme_name?: string
          scheme_type?: string | null
          scheme_year_valid?: string | null
          source_url?: string | null
          structures_eligible?: string | null
          subsidy_ceiling_per_unit?: number | null
          subsidy_ceiling_total?: number | null
          subsidy_percent_general?: number | null
          subsidy_percent_sc_st?: number | null
          subsidy_percent_women?: number | null
          subsidy_release_mode?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      subsidy_stacking_rules: {
        Row: {
          can_stack: number | null
          combined_ceiling: number | null
          conditions: string | null
          notes: string | null
          priority_order: string | null
          rule_id: number
          scheme_a_id: string | null
          scheme_b_id: string | null
        }
        Insert: {
          can_stack?: number | null
          combined_ceiling?: number | null
          conditions?: string | null
          notes?: string | null
          priority_order?: string | null
          rule_id?: number
          scheme_a_id?: string | null
          scheme_b_id?: string | null
        }
        Update: {
          can_stack?: number | null
          combined_ceiling?: number | null
          conditions?: string | null
          notes?: string | null
          priority_order?: string | null
          rule_id?: number
          scheme_a_id?: string | null
          scheme_b_id?: string | null
        }
        Relationships: []
      }
      variety_data: {
        Row: {
          cold_tolerance: string | null
          crop_id: string | null
          days_to_maturity: number | null
          disease_resistance: string | null
          germination_rate: number | null
          heat_tolerance: string | null
          notes: string | null
          recommended_for_protected: string | null
          seed_cost_per_gram: number | null
          suitable_states: string | null
          suitable_structure: string | null
          variety_id: string
          variety_name: string | null
          yield_per_sqm: number | null
          yield_unit: string | null
        }
        Insert: {
          cold_tolerance?: string | null
          crop_id?: string | null
          days_to_maturity?: number | null
          disease_resistance?: string | null
          germination_rate?: number | null
          heat_tolerance?: string | null
          notes?: string | null
          recommended_for_protected?: string | null
          seed_cost_per_gram?: number | null
          suitable_states?: string | null
          suitable_structure?: string | null
          variety_id: string
          variety_name?: string | null
          yield_per_sqm?: number | null
          yield_unit?: string | null
        }
        Update: {
          cold_tolerance?: string | null
          crop_id?: string | null
          days_to_maturity?: number | null
          disease_resistance?: string | null
          germination_rate?: number | null
          heat_tolerance?: string | null
          notes?: string | null
          recommended_for_protected?: string | null
          seed_cost_per_gram?: number | null
          suitable_states?: string | null
          suitable_structure?: string | null
          variety_id?: string
          variety_name?: string | null
          yield_per_sqm?: number | null
          yield_unit?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_bom: {
        Args: {
          p_area_sqm: number
          p_district_id?: string
          p_state: string
          p_structure_id: string
          p_tier?: string
        }
        Returns: {
          category_name: string
          is_essential: boolean
          material_id: string
          material_name: string
          quantity: number
          specification: string
          total_cost: number
          unit: string
          unit_price: number
          warnings: Json
        }[]
      }
      calculate_subsidy: {
        Args: {
          p_area_sqm: number
          p_farmer_category?: string
          p_is_first_time?: boolean
          p_land_holding?: number
          p_state: string
          p_structure_id: string
        }
        Returns: {
          ceiling_amount: number
          conditions: Json
          eligibility_status: string
          scheme_id: string
          scheme_name: string
          subsidy_amount: number
          subsidy_percent: number
        }[]
      }
      recommend_structures: {
        Args: {
          p_budget_per_sqm?: number
          p_crop_id: string
          p_district_id: string
        }
        Returns: {
          climate_match: string
          cost_max: number
          cost_min: number
          notes: string
          structure_id: string
          structure_name: string
          suitability_score: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
