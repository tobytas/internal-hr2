@IsTest(IsParallel=true OnInstall=true)
@SuppressWarnings('PMD.ApexUnitTestClassShouldHaveRunAs')
private class ExceptionsTest
{
    @IsTest
    static void shouldThrowExceptionWhenAssertionIsNegative()
    {
        try
        {
            Exceptions.whenever(true).raise('A');
            Assert.fail();
        }
        catch (Exceptions.GenericException e)
        {
            Assert.areEqual('A', e.getMessage());
        }
        
        try
        {
            Exceptions.unless(false).raise.failed.assertion('A');
            Assert.fail();
        }
        catch (Exceptions.AssertException e)
        {
            Assert.areEqual('A', e.getMessage());
        }
        
        try
        {
            Exceptions.whenever(true).report.failed.assertion('A');
            Assert.fail();
        }
        catch (Exceptions.AssertException e)
        {
            Assert.areEqual('A', e.getMessage());
        }
    }
    
    @IsTest
    static void shouldRaiseExceptionWhenSeverityIsAboveThreshold()
    {
        Exceptions.report(Exceptions.Severity.WARN);
        try
        {
            Exceptions.whenever(true).report.bad.argument('A');
            Assert.fail();
        }
        catch (Exceptions.ArgumentException e)
        {
            Assert.areEqual('A', e.getMessage());
        }
    }
    
    @IsTest
    static void shouldNotRaiseExceptionWhenSeverityIsBelowThreshold()
    {
        Exceptions.report(Exceptions.Severity.ERROR);
        Exceptions.whenever(true).raise(new Exceptions.GenericException(Exceptions.Severity.WARN, 'Warning!'));
        Exceptions.whenever(true).raise(new Exceptions.WarningException());
        
        Exceptions.unless(false).warn('A');//suppressed because it's below threshold
        
        Assert.isTrue(true);
    }
}