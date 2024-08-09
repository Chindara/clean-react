# Clear Architecture + React Solution Template 

This template provides a seamless solution by integrating the benefits of Clean Architecture with ASP.NET Core and ReactJS. It allows you to swiftly create a React application connected to an ASP.NET Core Web API, adhering to Clean Architecture principles. The template is pre-configured to use SQL Server, and upon running the application, the database will be automatically created, with the latest migrations applied.

If you find this project useful, please give it a star. Thanks! ⭐

## Getting Started

The following prerequisites are required to build and run the solution:

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) (latest version)
- [Node.js](https://nodejs.org/) (latest LTS)

Clone the repository to your computer. Once you are inside the root directory run the following command in PowerShell

```
dotnet new install .
```

Once installed, create a new solution using the template. 

```
dotnet new clean-react -o "<Name of the project>"
```

## Technologies

* [ASP.NET Core 8](https://docs.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core)
* [Entity Framework Core 8](https://docs.microsoft.com/en-us/ef/core/)
* [React 18](https://react.dev/)
* [MediatR](https://github.com/jbogard/MediatR)
* [AutoMapper](https://automapper.org/)
* [FluentValidation](https://fluentvalidation.net/)

### Template Commands
```
dotnet new list
```
```
dotnet new install . --force
```
```
dotnet new uninstall <path>
```