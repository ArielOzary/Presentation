using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoLog.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Add_RateCharges_OceanFreight_Fcl_And_Lcl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OceanFreightFcl",
                table: "RateCharges",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OceanFreightLcl",
                table: "RateCharges",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OceanFreightFcl",
                table: "RateCharges");

            migrationBuilder.DropColumn(
                name: "OceanFreightLcl",
                table: "RateCharges");
        }
    }
}
