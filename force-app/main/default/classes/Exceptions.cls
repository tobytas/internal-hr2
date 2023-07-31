/*
* @author illia leshchuk
*/
@SuppressWarnings('PMD.AvoidGlobalModifier')//suppressing report of global modifier since in theory it may be a part of 2nd gen package
global class Exceptions
{
	global enum Severity {WARN, ERROR, CRITICAL}
	
	global virtual class GenericException extends Exception
	{
		global Exceptions.Severity severity {get; protected set;}
		
		//setting default severity
		{
			this.severity = Exceptions.Severity.CRITICAL;
		}
		
		global GenericException(Exceptions.Severity severity, String message)
		{
			this(message);
			this.severity = severity;
		}
	}
	
	global virtual class ArgumentException extends GenericException {}
	global class AssertException extends GenericException {}
	global class WarningException extends GenericException
	{
		{
			this.severity = Exceptions.Severity.WARN;
		}
	}
	
	// exceptions dispatcher class
	global virtual class Dispatcher
	{
		//"syntactic sugar" for constructions like report.bad.argument('message')
		// or fail.assertion('assertion');
		global transient Dispatcher report { get {return this;} }
		global transient Dispatcher bad { get {return this;} }
		global transient Dispatcher raise { get {return this;} }
		global transient Dispatcher failed { get {return this;} }
		
		global Exceptions.Severity threshold = Exceptions.Severity.ERROR;
		
		@SuppressWarnings('PMD.EmptyStatementBlock')
		protected Dispatcher() {/* private constructor */}
		global virtual void raise(Exception e)
		{
			if (!suppressed(e))
			{
				throw e;
			}
			
			System.debug(System.LoggingLevel.WARN, e.getMessage());//todo: consider deletion
		}
		
		//shorthand for raising a GenericException with the given message
		global void raise(String message)
		{
			raise(new GenericException(message));
		}
		
		//shorthand for raising a ArgumentException with the given message
		global void argument(String message)
		{
			raise(new ArgumentException(message));
		}
		
		//shorthand for raising a WarningException with the given message
		global void warn(String message)
		{
			raise(new WarningException(message));
		}
		
		//shorthand for raising a AssertException with the given message
		global void assertion(String message)
		{
			raise(new AssertException(message));
		}
		
		//returns TRUE if a given Exception should be suppressed, i.e. it's severity is below reporting threshold
		private Boolean suppressed(Exception e)
		{
			return e instanceof GenericException
					&& Exceptions.Severity.values().indexOf(threshold) > Exceptions.Severity.values().indexOf(((GenericException) e).severity);
		}
	}
	
	private static final Dispatcher DISPATCHER = new Dispatcher();
	
	//a named constructor which may return NULL and should be used to leverage
	// "safe resolution operator short-circuiting" feature, e.g.
	// Exceptions.whenever(<positive_assertion_which_should_result_in_exception>)?.raise(...);
	global static Dispatcher whenever(Boolean assertion)
	{
		return assertion == true ? DISPATCHER : null;
	}
	
	//a named constructor which may return NULL and should be used to leverage
	// "safe resolution operator short-circuiting" feature
	// Exceptions.unless(<positive_assertion_which_should_prevent_exception>)?.raise(...);
	// for example:
	// Exceptions.unless(amount != null)?.report.bad.argument('Argument amount:Integer cannot be null!');
	global static Dispatcher unless(Boolean assertion)
	{
		return whenever(assertion == false);
	}
	
	// Configures Exceptions class to raise exceptions which have severity not less than a certain threshold
	// and returns previous threshold value. Works only with GenericException kind of exceptions.
	global static Severity report(Severity threshold)
	{
		whenever(threshold == null)?.report.bad.argument(Exceptions.class.getName() + '.report(Severity threshold): ERROR: '
				+ 'Argument threshold:Severity cannot be null!');
		
		Severity prior = DISPATCHER.threshold;
		DISPATCHER.threshold = threshold;
		
		return prior;
	}
}