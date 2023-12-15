using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoLog.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Add_Rate_RateCharges_ShippingType : Migration
    {
        /// <inheritdoc />
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0053:Use expression body for lambda expression", Justification = "<Pending>")]
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RateCharges",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FixedPriced = table.Column<string>(type: "nvarchar(max)", nullable: false, defaultValue: ""),
                    PerWeight = table.Column<string>(type: "nvarchar(max)", nullable: false, defaultValue: ""),
                    PerType = table.Column<string>(type: "nvarchar(max)", nullable: false, defaultValue: ""),
                    PerValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InLand = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AirFreight = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RateCharges", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShippingTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ShipmentType = table.Column<int>(type: "int", nullable: false),
                    ShipmentIncoterms = table.Column<int>(type: "int", nullable: false),
                    ShipmentOption = table.Column<int>(type: "int", nullable: false),
                    Insurance = table.Column<bool>(type: "bit", nullable: false),
                    Customs = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShippingTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Rates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDraft = table.Column<bool>(type: "bit", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FreightChargesId = table.Column<int>(type: "int", nullable: true),
                    OriginChargesId = table.Column<int>(type: "int", nullable: true),
                    DestinationChargesId = table.Column<int>(type: "int", nullable: true),
                    ShippingTypeId = table.Column<int>(type: "int", nullable: true),
                    CarrierId = table.Column<int>(type: "int", nullable: true),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rates_Companies_CarrierId",
                        column: x => x.CarrierId,
                        principalTable: "Companies",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Rates_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Rates_RateCharges_DestinationChargesId",
                        column: x => x.DestinationChargesId,
                        principalTable: "RateCharges",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Rates_RateCharges_FreightChargesId",
                        column: x => x.FreightChargesId,
                        principalTable: "RateCharges",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Rates_RateCharges_OriginChargesId",
                        column: x => x.OriginChargesId,
                        principalTable: "RateCharges",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Rates_ShippingTypes_ShippingTypeId",
                        column: x => x.ShippingTypeId,
                        principalTable: "ShippingTypes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Rates_CarrierId",
                table: "Rates",
                column: "CarrierId");

            migrationBuilder.CreateIndex(
                name: "IX_Rates_CompanyId",
                table: "Rates",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Rates_DestinationChargesId",
                table: "Rates",
                column: "DestinationChargesId");

            migrationBuilder.CreateIndex(
                name: "IX_Rates_FreightChargesId",
                table: "Rates",
                column: "FreightChargesId");

            migrationBuilder.CreateIndex(
                name: "IX_Rates_OriginChargesId",
                table: "Rates",
                column: "OriginChargesId");

            migrationBuilder.CreateIndex(
                name: "IX_Rates_ShippingTypeId",
                table: "Rates",
                column: "ShippingTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rates");

            migrationBuilder.DropTable(
                name: "RateCharges");

            migrationBuilder.DropTable(
                name: "ShippingTypes");
        }
    }
}
