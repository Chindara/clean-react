using System.ComponentModel;
using System.Reflection;

namespace CleanArchitectureTemplate.Domain.Primitives;
public class Enums
{
    public static int GetEnumKey<TEnum>(string inputString) where TEnum : struct, Enum
    {
        try
        {
            TEnum enumValue = (TEnum)Enum.Parse(typeof(TEnum), inputString);
            return (int)(object)enumValue; // Get the numeric value
        }
        catch (ArgumentException)
        {
            return 0; // Not a valid enum member
        }
    }

    public static string GetEnumValue<TEnum>(int enumKey)
            where TEnum : Enum
    {
        if (Enum.IsDefined(typeof(TEnum), enumKey))
        {
            return ((TEnum)(object)enumKey).ToString();
        }

        // Handle the case where the provided enumKey is not a valid value for the specified enum type.
        // You might want to throw an exception, return a default value, or handle it based on your requirements.
        return "Unknown";
    }

    public static string GetEnumValue2<TEnum>(int enumKey) where TEnum : Enum
    {
        if (Enum.IsDefined(typeof(TEnum), enumKey))
        {
            return GetEnumDescription((TEnum)(object)enumKey);
        }

        return "Unknown";
    }

    private static string GetEnumDescription<TEnum>(TEnum enumValue) where TEnum : Enum
    {
        FieldInfo field = enumValue.GetType().GetField(enumValue.ToString());
        DescriptionAttribute attribute = field.GetCustomAttributes(typeof(DescriptionAttribute), false)
                                              .FirstOrDefault() as DescriptionAttribute;

        return attribute == null ? enumValue.ToString() : attribute.Description;
    }
}

public enum RecordStatus
{
    Active = 1,
    Inactive = 2,
    Deleted = 3
}

public enum UserStatus
{
    NewUser = 1,
    Active = 2,
    Inactive = 3,
    Locked = 4,
    PasswordReset = 5,
    Deleted = 6
}

public enum UserType
{
    SuperUser = 1,
    Admin = 2,
    User = 3,
}
