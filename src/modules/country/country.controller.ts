import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CountryService } from '../../shared/services/country.service';

@ApiTags('countries')
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) { }

  @Get('/all')
  async getCountries() {
    return await this.countryService.findAll();
  }


  // @Get('/all/used')
  // async getCountriesWithFlights() {
  //   return await this.countryService.findAllWithFlights();
  // }

  @Get('/name/:name')
  async getCountryByName(@Param('name') name: string) {
    return await this.countryService.findByName(name);
  }


}
