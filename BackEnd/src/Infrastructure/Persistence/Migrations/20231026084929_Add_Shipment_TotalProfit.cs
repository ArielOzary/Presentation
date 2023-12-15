using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoLog.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Add_Shipment_TotalProfit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "ShipmentTotalProfit",
                table: "Shipments",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShipmentTotalProfit",
                table: "Shipments");
        }
    }
}
