using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoLog.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CompanyLocation_SetCascade_Deleted_Settings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CompanyLocations_Ports_DestinationPortId",
                table: "CompanyLocations");

            migrationBuilder.DropForeignKey(
                name: "FK_ShippingLocations_Ports_PortId",
                table: "ShippingLocations");

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyLocations_Ports_DestinationPortId",
                table: "CompanyLocations",
                column: "DestinationPortId",
                principalTable: "Ports",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_ShippingLocations_Ports_PortId",
                table: "ShippingLocations",
                column: "PortId",
                principalTable: "Ports",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CompanyLocations_Ports_DestinationPortId",
                table: "CompanyLocations");

            migrationBuilder.DropForeignKey(
                name: "FK_ShippingLocations_Ports_PortId",
                table: "ShippingLocations");

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyLocations_Ports_DestinationPortId",
                table: "CompanyLocations",
                column: "DestinationPortId",
                principalTable: "Ports",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ShippingLocations_Ports_PortId",
                table: "ShippingLocations",
                column: "PortId",
                principalTable: "Ports",
                principalColumn: "Id");
        }
    }
}
