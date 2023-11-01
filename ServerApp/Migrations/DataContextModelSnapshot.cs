﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SimpleResourceMonitor.Data;

#nullable disable

namespace SimpleResourceMonitor.ServerApp.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("SimpleResourceMonitor.Models.Instance", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    b.Property<string>("Name")
                        .HasColumnType("longtext");

                    b.Property<string>("OS")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Instances");
                });

            modelBuilder.Entity("SimpleResourceMonitor.Models.InstanceConnection", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    b.Property<string>("IP")
                        .HasColumnType("longtext");

                    b.Property<long>("InstanceId")
                        .HasColumnType("bigint");

                    b.Property<string>("SshKeyPassphrase")
                        .HasColumnType("longtext");

                    b.Property<string>("SshPassword")
                        .HasColumnType("longtext");

                    b.Property<byte[]>("SshPrivateKey")
                        .HasColumnType("longblob");

                    b.Property<string>("SshUsername")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("InstanceId");

                    b.ToTable("InstanceConnections");
                });

            modelBuilder.Entity("SimpleResourceMonitor.Models.InstanceConnection", b =>
                {
                    b.HasOne("SimpleResourceMonitor.Models.Instance", "Instance")
                        .WithMany("InstanceConnections")
                        .HasForeignKey("InstanceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Instance");
                });

            modelBuilder.Entity("SimpleResourceMonitor.Models.Instance", b =>
                {
                    b.Navigation("InstanceConnections");
                });
#pragma warning restore 612, 618
        }
    }
}
